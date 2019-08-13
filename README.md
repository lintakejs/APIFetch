# APIFetch
给予axios封装的请求类

## Usage
增加拦截器钩子函数，并能处理重复的请求
___

You can install with npm.

    npm install api-fetch


```javascript
import Fetch from 'api-fetch'

const Fetch = new Fetch({
  beforeRequest?: (nowConfig?: AxiosRequestConfig, initConfig?: AxiosRequestConfig) => void | AxiosRequestConfig;
  requestError?: (err?: Error, nowConfig?: AxiosRequestConfig, initConfig?: AxiosRequestConfig) => void | AxiosRequestConfig;
  beforeResponse?: (responseData: AxiosResponse, nowConfig?: AxiosRequestConfig, initConfig?: AxiosRequestConfig) => any;
  responseError?: (err?: Error, nowConfig?: AxiosRequestConfig, initConfig?: AxiosRequestConfig) => void | AxiosRequestConfig;
})
``` 

## API
```javascript
  get (url: string, data?: object, options?: object)
```
```javascript
  post (url: string, data?: object, options?: object)
```
```javascript
  put (url: string, data?: object, options?: object)
```
```javascript
  delete (url: string, data?: object, options?: object)
```