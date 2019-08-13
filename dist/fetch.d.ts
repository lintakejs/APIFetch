import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
interface apiFetchConfig extends AxiosRequestConfig {
    beforeRequest?: (nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => void | apiFetchConfig;
    requestError?: (err?: Error, nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => void | apiFetchConfig;
    beforeResponse?: (responseData: AxiosResponse, nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => any;
    responseError?: (err?: Error, nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => void | apiFetchConfig;
    [propName: string]: any;
}
export default class Fetch {
    private config;
    private fetchInstance;
    private fetchSendCancelToken;
    private fetchSendCancelTokenHashMap;
    private fetchId;
    constructor(config?: apiFetchConfig);
    get(url: string, data?: any, options?: object): AxiosPromise<AxiosResponse>;
    post(url: string, data?: any, options?: object): AxiosPromise<AxiosResponse>;
    put(url: string, data?: any, options?: object): AxiosPromise<AxiosResponse>;
    delete(url: string, data?: any, options?: object): AxiosPromise<AxiosResponse>;
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
    private constructArgs;
    private initIntercept;
    private addFetchSendCancelToken;
    private removeFetchSendCancelToken;
    private cancelFetchSendCancelToken;
}
export {};
