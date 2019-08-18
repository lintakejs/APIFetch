import axios from 'axios';
import { Observable } from 'rxjs';
var FetchCancelToken = axios.CancelToken;
var Fetch = /** @class */ (function () {
    function Fetch(config) {
        this.config = config;
        this.fetchInstance = axios.create(config);
        this.initIntercept();
    }
    Fetch.prototype.get = function (url, data, options) {
        var config = this.constructArgs('GET', url, data, options);
        return this.createAxiosObservable(this.fetchInstance, config);
    };
    Fetch.prototype.post = function (url, data, options) {
        var config = this.constructArgs('POST', url, data, options);
        return this.createAxiosObservable(this.fetchInstance, config);
    };
    Fetch.prototype.put = function (url, data, options) {
        var config = this.constructArgs('PUT', url, data, options);
        return this.createAxiosObservable(this.fetchInstance, config);
    };
    Fetch.prototype.delete = function (url, data, options) {
        var config = this.constructArgs('DELETE', url, data, options);
        return this.createAxiosObservable(this.fetchInstance, config);
    };
    /**
     * 构建参数
     *
     * //请求类型
     * @param mehods
     * //请求路径
     * @param url
     * //请求数据
     * @param data
     * //请求选项
     * @param options
     */
    Fetch.prototype.constructArgs = function (methods, url, data, options) {
        var config = {
            method: methods.toLocaleLowerCase(),
            url: url
        };
        if (options) {
            config.otherOptions = options;
        }
        if (methods === 'GET' || methods === 'DELETE') {
            config.params = data || {};
        }
        else {
            config.data = data || {};
        }
        config.cancelToken = new FetchCancelToken(function (cancel) {
            config.cancel = cancel;
        });
        return config;
    };
    // 初始化请求拦截器
    Fetch.prototype.initIntercept = function () {
        var _this = this;
        this.fetchInstance.interceptors.request.use(function (config) {
            if (_this.config.beforeRequest) {
                var conf = _this.config.beforeRequest(config, _this.config);
                return conf || config;
            }
            else {
                return config;
            }
        }, function (error) {
            if (_this.config.requestError) {
                var err = _this.config.requestError(error, _this.config);
                return err || Promise.reject(error);
            }
            else {
                return Promise.reject(error);
            }
        });
        // 返回参数时拦截
        this.fetchInstance.interceptors.response.use(function (response) {
            if (_this.config.beforeResponse) {
                var req = _this.config.beforeResponse(response, _this.config, response.config);
                return req || response;
            }
            else {
                return response;
            }
        }, function (error) {
            if (_this.config.responseError) {
                var err = _this.config.responseError(error, _this.config);
                return err || Promise.reject(error);
            }
            else {
                return Promise.reject(error);
            }
        });
    };
    Fetch.prototype.createAxiosObservable = function (axiosPromiseFactory, config) {
        var _this = this;
        var observable = new Observable(function (observer) {
            _this.fetchInstance(config).then(function (response) {
                observer.next(response);
                observer.complete();
            }).catch(function (err) {
                observer.error(err);
            });
        });
        var _subscribe = observable.subscribe.bind(observable);
        observable.subscribe = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var subscription = _subscribe.apply(void 0, args);
            var _unsubscribe = subscription.unsubscribe.bind(subscription);
            subscription.unsubscribe = function () {
                if (config.cancel) {
                    config.cancel();
                }
                _unsubscribe();
            };
            return subscription;
        };
        return observable;
    };
    return Fetch;
}());
export default Fetch;
