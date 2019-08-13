import axios from 'axios';
import HashMap from 'hashmap';
var FetchCancelToken = axios.CancelToken;
var Fetch = /** @class */ (function () {
    function Fetch(config) {
        this.fetchSendCancelToken = [];
        this.fetchSendCancelTokenHashMap = new HashMap();
        this.fetchId = 1;
        this.config = config || {};
        this.fetchInstance = axios.create(config);
        this.initIntercept();
    }
    Fetch.prototype.get = function (url, data, options) {
        var config = this.constructArgs('GET', url, data, options);
        return this.fetchInstance(config);
    };
    Fetch.prototype.post = function (url, data, options) {
        var config = this.constructArgs('POST', url, data, options);
        return this.fetchInstance(config);
    };
    Fetch.prototype.put = function (url, data, options) {
        var config = this.constructArgs('PUT', url, data, options);
        return this.fetchInstance(config);
    };
    Fetch.prototype.delete = function (url, data, options) {
        var config = this.constructArgs('DELETE', url, data, options);
        return this.fetchInstance(config);
    };
    // public all (fetchAll: any) {
    //   return axios.all(fetchAll).then(axios.spread(function (...results) {
    //     return Promise.resolve(results)
    //   }))
    // }
    // 取消请求
    // public cancel (message: any) {
    //   return source.cancel(message)
    // }
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
            url: url,
            fetchId: this.fetchId++
        };
        if (options) {
            config.options = options;
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
            // 执行前，需要增加cancelToken，并且放入数组中维护
            _this.addFetchSendCancelToken(config);
            // 如果初始化有前置方法，则执行
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
            // 在执行后需要清除之前存在的cancelToken
            _this.removeFetchSendCancelToken(response);
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
    Fetch.prototype.addFetchSendCancelToken = function (config) {
        var requestConfig = {
            url: (config.baseURL || '') + config.url,
            method: config.method,
            paramsOrData: (config.method === 'get' || config.method === 'delete') ? config.params : config.data
        };
        // 增加前需要取消原本已经存在的
        this.cancelFetchSendCancelToken(requestConfig, config, 'req');
        // hashMap增加一个请求参数存储
        this.fetchSendCancelTokenHashMap.set(config.fetchId, JSON.stringify(requestConfig));
    };
    Fetch.prototype.removeFetchSendCancelToken = function (response) {
        var config = response.config;
        var responseConfig = {
            url: config.url,
            method: config.method,
            paramsOrData: (config.method === 'get' || config.method === 'delete') ? config.params : JSON.parse(config.data)
        };
        this.cancelFetchSendCancelToken(responseConfig, config, 'res');
    };
    Fetch.prototype.cancelFetchSendCancelToken = function (sendConfig, config, type) {
        var configIndex = this.fetchSendCancelTokenHashMap.search(JSON.stringify(sendConfig));
        if (configIndex !== null) {
            if (type === 'req') {
                config.cancel('请求已取消');
            }
            this.fetchSendCancelTokenHashMap.remove(configIndex);
        }
    };
    return Fetch;
}());
export default Fetch;
