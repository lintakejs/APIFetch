import { Canceler, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
interface apiFetchConfig extends AxiosRequestConfig {
    beforeRequest?: (nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => void | apiFetchConfig;
    requestError?: (err?: Error, initConfig?: apiFetchConfig) => void | apiFetchConfig;
    beforeResponse?: (responseData: AxiosResponse, nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => any;
    responseError?: (err?: Error, initConfig?: apiFetchConfig) => void | apiFetchConfig;
    cancel?: Canceler;
    otherOptions?: object;
}
interface AxiosObservable<T> extends Observable<AxiosResponse<T>> {
}
export default class Fetch {
    private config;
    private fetchInstance;
    constructor(config: apiFetchConfig);
    get<T = any>(url: string, data?: any, options?: object): AxiosObservable<T>;
    post<T = any>(url: string, data?: any, options?: object): AxiosObservable<T>;
    put<T = any>(url: string, data?: any, options?: object): AxiosObservable<T>;
    delete<T = any>(url: string, data?: any, options?: object): AxiosObservable<T>;
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
    private createAxiosObservable;
}
export {};
