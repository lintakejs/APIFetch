"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var CancelToken = axios_1.default.CancelToken;
var source = CancelToken.source();
var Fetch = /** @class */ (function () {
    function Fetch(config) {
        this.config = config || {};
        this.fetchInstance = axios_1.default.create(config);
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
    Fetch.prototype.all = function (fetchAll) {
        return axios_1.default.all(fetchAll).then(axios_1.default.spread(function () {
            var results = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                results[_i] = arguments[_i];
            }
            Promise.resolve(results);
        }));
    };
    // 取消请求
    Fetch.prototype.cancel = function (message) {
        return source.cancel(message);
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
        var fetchMethods = methods.toLowerCase();
        var config = {
            method: fetchMethods,
            url: url,
            options: options || {}
        };
        if (fetchMethods === 'get' || fetchMethods === 'delete') {
            config.params = data || {};
        }
        else {
            config.data = data || {};
        }
        // 合并config
        config = __assign({}, config, config.options);
        // 添加 canceltoken
        config.cancelToken = source.token;
        return config;
    };
    // 初始化请求拦截器
    Fetch.prototype.initIntercept = function () {
        var _this = this;
        this.requestInstance = this.fetchInstance.interceptors.request.use(function (config) {
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
        this.responseInstance = this.fetchInstance.interceptors.response.use(function (response) {
            if (_this.config.beforeResponse) {
                return _this.config.beforeResponse(response, _this.config, response.config);
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
    return Fetch;
}());
exports.default = Fetch;
