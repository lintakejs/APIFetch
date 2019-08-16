import axios, { Canceler, AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosPromise } from 'axios'
import { Observable } from 'rxjs'

interface apiFetchConfig extends AxiosRequestConfig {
  beforeRequest?: (nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => void | apiFetchConfig;
  requestError?: (err?: Error, initConfig?: apiFetchConfig) => void | apiFetchConfig;
  beforeResponse?: (responseData: AxiosResponse, nowConfig?: apiFetchConfig, initConfig?: apiFetchConfig) => any;
  responseError?: (err?: Error, initConfig?: apiFetchConfig) => void | apiFetchConfig;
  cancel?: Canceler,
  otherOptions?: object
}

interface AxiosObservable<T> extends Observable<AxiosResponse<T>>{}

const FetchCancelToken = axios.CancelToken

export default class Fetch {
  private config: apiFetchConfig;
  private fetchInstance: AxiosInstance;

  constructor (config: apiFetchConfig) {
    this.config = config
    this.fetchInstance = axios.create(config)
    this.initIntercept()
  }

  public get<T = any> (url: string, data?: any, options?: object): AxiosObservable<T> {
    let config = this.constructArgs('GET', url, data, options)
    return this.createAxiosObservable(this.fetchInstance, config)
  }

  public post<T = any> (url: string, data?: any, options?: object): AxiosObservable<T> {
    let config = this.constructArgs('POST', url, data, options)
    return this.createAxiosObservable(this.fetchInstance, config)
  }

  public put<T = any> (url: string, data?: any, options?: object): AxiosObservable<T> {
    let config = this.constructArgs('PUT', url, data, options)
    return this.createAxiosObservable(this.fetchInstance, config)
  }

  public delete<T = any> (url: string, data?: any, options?: object): AxiosObservable<T> {
    let config = this.constructArgs('DELETE', url, data, options)
    return this.createAxiosObservable(this.fetchInstance, config)
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
  private constructArgs (methods: string, url: string, data?: any, options?: object): apiFetchConfig {
    let config: apiFetchConfig = {
      method: methods.toLocaleLowerCase(),
      url: url
    }
    if (options) {
      config.otherOptions = options
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

  private createAxiosObservable<T> (axiosPromiseFactory: (apiConfig: AxiosRequestConfig) => AxiosPromise<T>, config: apiFetchConfig): AxiosObservable<T> {
    const observable: AxiosObservable<T> = new Observable(observer => {
      this.fetchInstance(config).then(response => {
        observer.next(response)
        observer.complete()
      }).catch(err => {
        observer.error(err)
      })
    })

    const _subscribe = observable.subscribe.bind(observable)

    observable.subscribe = (...args: any[]) => {
      const subscription = _subscribe(...args)
      const _unsubscribe = subscription.unsubscribe.bind(subscription)

      subscription.unsubscribe = () => {
        if (config.cancel) {
          config.cancel()
        }
        _unsubscribe()
      }

      return subscription
    }

    return observable
  }
}
