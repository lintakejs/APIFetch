interface config {
    baseURL?: string;
    timeout?: number;
    headers?: any;
    withCredentials?: boolean;
    responseType?: any;
    beforeRequest?: (config?: any, oldConfig?: any) => any;
    allBeforeRequest?: (fetchOptions?: any, oldConfig?: any) => any;
    requestError?: (err?: any, config?: any) => any;
    beforeResponse?: (data?: any, Config?: any, oldConfig?: any) => any;
    allBeforeResponse?: (fetchOptionsAndResData?: any, oldConfig?: any) => any;
    responseError?: (err?: any, config?: any) => any;
    [propName: string]: any;
}
interface allParam {
    methods: string;
    url: string;
    data?: any;
}
export default class Fetch {
    config: config;
    fetchInstance: any;
    fetchInstanceAll: any;
    requestInstance?: any;
    responseInstance?: any;
    constructor(config?: config);
    get(url: string, data?: object, options?: object): any;
    post(url: string, data?: object, options?: object): any;
    put(url: string, data?: object, options?: object): any;
    delete(url: string, data?: object, options?: object): any;
    all(fetchAll: Array<allParam>, options?: object): Promise<void | {}[]>;
    cancel(message: any): void;
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
}
export {};
