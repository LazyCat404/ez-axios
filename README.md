# ez-axios

> 基于axios的二次封装

## 快速使用

```js
import { get, post, put, del } from 'ez-axios';

// 直接使用
get('/url').then(res => {
  cosnole.log(res);
});

// api集成引用
const api = {
  login: (par: any): Promise<any> => post('/url', par)
}
api.login({name: 'test'}).then(res => {
  console.log(res);
});

```

## 全局配置

> 通过自定义配置，统一处全局规则，如：请求头、请求超时时间等。全局配置需要写在使用请求之前，且请求配置项会覆盖全局配置，如果你是 VUE 项目，可以在 `main.js` 中引入。

```js
// main.js
import ezAxios from 'ez-axios';

ezAxios({
  baseURL: '', // 基础地址
  timeout: 30000, // 请求超时时间
  briefly: true, // 简要数据结构
  loading: true, // 是否显示加载动画
  headers: {}, // 请求头
  error: status => {} // 错误处理
});

// 全局配置项均为非必填，以上值为内置默认值。
```

## 请求方法参数说明

> `ez-axios` 在封装了 `get`、`post`、`put`、`del` 四种常用的请求方法，可以根据需求选择使用。如果你苦恼于看文档，可以尝试在引用时，配合注释提示，快速了解每一个参数的含义。

- 前两个参数只能是**请求地址**，**请求参数**（参数值仅支持：`Object`、`Array`、`File`）。

- 可以指定`请求参数类型`、`返回值类型`。
  - 请求参数类型（`requestType`）可用值（`get` 请求无法指定）：`json`、`query`、`form-data`/`formdata`/`data`、`file`。

  - 返回值类型（`responseType`）可用值：`blob`（多用于文件、下载），若不指定，则默认返回。

  - `requestType`、`responseType`：可同时指定，如：`post('/url',{name: 'test'},'query','blob')`。

- 可单独设置`请求头`、`请求超时时间`、`简要数据结构`、`是否显示加载动画`、`错误处理`，会覆盖全局配置。

  ```js
  get(
    '/url',
    { name: 'test' },
    {
      loading: false, // 不显示显示加载动画
      headers: {
        // 请求头
        token: 'k7r+vB0fj+dqxcRF3hZ2cQ=='
      }
    }
  );
  ```

- 从第三个参数开始，后面的参数均为**可选参数**，**不限制顺序**，**不区分大小写**。

## 后续优化方向

- 手动取消

- 切片、断点续传

- 请求进度条
