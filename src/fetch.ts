import axios, { Canceler, AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosPromise } from 'axios'
import HashMap from 'hashmap'

interface apiFetchConfig extends AxiosRequestConfig {
  beforeRequest?: (nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => void | apiFetchConfig;
  requestError?: (err?: Error, nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => void | apiFetchConfig;
  beforeResponse?: (responseData: AxiosResponse, nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => any;
  responseError?: (err?: Error, nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => void | apiFetchConfig;
  [propName: string]: any;
}

const FetchCancelToken = axios.CancelToken

export default class Fetch {
  private config: apiFetchConfig;
  private fetchInstance: AxiosInstance;
  private fetchSendCancelToken: Array<{
    sendConfig: {
      url: string | undefined,
      method: string | undefined,
      paramsOrData?: any
    },
    cancel: Canceler
  }> = [];
  private fetchSendCancelTokenHashMap = new HashMap()
  private fetchId: number = 1;

  constructor (config?: apiFetchConfig) {
    this.config = config || {}
    this.fetchInstance = axios.create(config)
    this.initIntercept()
  }

  public get (url: string, data?: any, options?: object): AxiosPromise<AxiosResponse> {
    let config = this.constructArgs('GET', url, data, options)
    return this.fetchInstance(config)
  }

  public post (url: string, data?: any, options?: object): AxiosPromise<AxiosResponse> {
    let config = this.constructArgs('POST', url, data, options)
    return this.fetchInstance(config)
  }

  public put (url: string, data?: any, options?: object): AxiosPromise<AxiosResponse> {
    let config = this.constructArgs('PUT', url, data, options)
    return this.fetchInstance(config)
  }

  public delete (url: string, data?: any, options?: object): AxiosPromise<AxiosResponse> {
    let config = this.constructArgs('DELETE', url, data, options)
    return this.fetchInstance(config)
  }

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
  private constructArgs (methods: string, url: string, data?: any, options?: object): apiFetchConfig {
    let config: apiFetchConfig = {
      method: methods.toLocaleLowerCase(),
      url: url,
      fetchId: this.fetchId++
    }
    if (options) {
      config.options = options
    }

    if (methods === 'GET' || methods === 'DELETE') {
      config.params = data || {}
    } else {
      config.data = data || {}
    }

    config.cancelToken = new FetchCancelToken((cancel) => {
      config.cancel = cancel
    })

    return config
  }

  // 初始化请求拦截器
  private initIntercept () {
    this.fetchInstance.interceptors.request.use(
      (config) => {
        // 执行前，需要增加cancelToken，并且放入数组中维护
        this.addFetchSendCancelToken(config)
        // 如果初始化有前置方法，则执行
        if (this.config.beforeRequest) {
          const conf = this.config.beforeRequest(config, this.config)
          return conf || config
        } else {
          return config
        }
      },
      (error) => {
        if (this.config.requestError) {
          const err = this.config.requestError(error, this.config)
          return err || Promise.reject(error)
        } else {
          return Promise.reject(error)
        }
      }
    )
    // 返回参数时拦截
    this.fetchInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 在执行后需要清除之前存在的cancelToken
        this.removeFetchSendCancelToken(response)
        if (this.config.beforeResponse) {
          const req = this.config.beforeResponse(response, this.config, response.config)
          return req || response
        } else {
          return response
        }
      },
      (error) => {
        if (this.config.responseError) {
          const err = this.config.responseError(error, this.config)
          return err || Promise.reject(error)
        } else {
          return Promise.reject(error)
        }
      }
    )
  }

  private addFetchSendCancelToken (config: apiFetchConfig) {
    const requestConfig = {
      url: (config.baseURL || '') + config.url,
      method: config.method,
      paramsOrData: (config.method === 'get' || config.method === 'delete') ? config.params : config.data
    }
    // 增加前需要取消原本已经存在的
    this.cancelFetchSendCancelToken(requestConfig, config, 'req')
    // hashMap增加一个请求参数存储
    this.fetchSendCancelTokenHashMap.set(config.fetchId, JSON.stringify(requestConfig))
  }

  private removeFetchSendCancelToken (response: AxiosResponse) {
    const { config } = response
    const responseConfig = {
      url: config.url,
      method: config.method,
      paramsOrData: (config.method === 'get' || config.method === 'delete') ? config.params : JSON.parse(config.data)
    }
    this.cancelFetchSendCancelToken(responseConfig, config, 'res')
  }

  private cancelFetchSendCancelToken (sendConfig: { url: string | undefined, method: string | undefined, paramsOrData?: any }, config: apiFetchConfig, type: 'res' | 'req') {
    const configIndex = this.fetchSendCancelTokenHashMap.search(JSON.stringify(sendConfig))
    if (configIndex !== null) {
      if (type === 'req') {
        config.cancel('请求已取消')
      }
      this.fetchSendCancelTokenHashMap.remove(configIndex)
    }
  }
}
