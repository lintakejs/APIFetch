# APIFetch
给予axios封装的请求类

## Usage

___

You can install with npm.

    npm install APIFetch


```javascript
import Fetch from 'APIFetch'

const Fetch = new Fetch({
  baseUrl: '/',
  timeout: 8000,
  beforeRequest: function () {},
  beforeResponse: function () {},
  // 等诸多axios的方法
  /**
   * 额外提供下列方法
  */
  allBeforeRequest: function (fetchOptions, oldConfig) {},
  allBeforeResponse: function (fetchOptionsAndResData, oldConfig) {}
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
```javascript
  // 需要注意的是all 方法调用与其他方式不同，需要符合标准格式
  // all方法不触发beforeRequest与beforeResponse等，但是触发allBeforeRequest与allBeforeResponse

  all(
    [
      {
        methods: 'get',
        url: 'xxxxx',
        data: {
          x: 1
        }
      }
    ],
    {
      quite: true
    }
  )
```