import axios from 'axios'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

interface config {
  baseURL?: string;
  timeout?: number;
  headers?: any;
  // 是否携带cookie信息
  withCredentials?: boolean;
  // 返回类型
  responseType?: any;
  // beforeRequest
  beforeRequest?: (config?: any, oldConfig?: any) => any;
  // requestError
  requestError?: (err?: any, config?: any) => any;
  // beforeResponse
  beforeResponse?: (data?: any, Config?: any, oldConfig?: any) => any;
  // responseError
  responseError?: (err?: any, config?: any) => any;

  [propName: string]: any;
}

export default class Fetch {
  config: config;
  fetchInstance: any;
  requestInstance?: any;
  responseInstance?: any;

  constructor (config?: config) {
    this.config = config || {}
    this.fetchInstance = axios.create(config)
    this.initIntercept()
  }

  public get (url: string, data?: object, options?: object) {
    let config = this.constructArgs('GET', url, data, options)
    return this.fetchInstance(config)
  }

  public post (url: string, data?: object, options?: object) {
    let config = this.constructArgs('POST', url, data, options)
    return this.fetchInstance(config)
  }

  public put (url: string, data?: object, options?: object) {
    let config = this.constructArgs('PUT', url, data, options)
    return this.fetchInstance(config)
  }

  public delete (url: string, data?: object, options?: object) {
    let config = this.constructArgs('DELETE', url, data, options)
    return this.fetchInstance(config)
  }

  public all (fetchAll: any) {
    return axios.all(fetchAll).then(axios.spread(function (...results) {
      return Promise.resolve(results)
    }))
  }

  // 取消请求
	public cancel (message: any) {
		return source.cancel(message)
	}

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
	private constructArgs (methods: string, url: string, data?: object, options?: object) {
    const fetchMethods = methods.toLowerCase()

    let config:any = {
      method: fetchMethods,
      url: url,
      options: options || {}
    }
    
    if(fetchMethods === 'get' || fetchMethods === 'delete'){
      config.params = data || {}
    } else {
      config.data = data || {}
    }
    // 合并config
    config = { ...config, ...config.options }

    // 添加 canceltoken
		config.cancelToken = source.token

    return config
  }

  // 初始化请求拦截器
	private initIntercept () {
    this.requestInstance = this.fetchInstance.interceptors.request.use(
      (config: any) => {
        if(this.config.beforeRequest){
          const conf = this.config.beforeRequest(config, this.config)
          return conf || config
        } else {
          return config
        }
      },
      (error: any) => {
        if(this.config.requestError) {
          const err = this.config.requestError(error, this.config)
          return err || Promise.reject(error)
        } else {
          return Promise.reject(error)
        }
      }
    )
    // 返回参数时拦截
    this.responseInstance = this.fetchInstance.interceptors.response.use(
      (response: any) => {
        if(this.config.beforeResponse) {
          return this.config.beforeResponse(response, this.config, response.config)
        } else {
          return response
        }
      },
      (error: any) => {
        if(this.config.responseError){
          const err = this.config.responseError(error, this.config)
          return err || Promise.reject(error)
        } else {
          return Promise.reject(error)
        }
      }
    )
  }
}