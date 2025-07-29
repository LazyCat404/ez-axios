# ez-axios

> 基于axios的二次封装

## 安装

```js
npm install ez-axios
```

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

> 通过自定义配置，统一配置全局规则，如：请求头、请求超时时间等。全局配置需要写在使用请求之前，且请求配置项会覆盖全局配置，如果你是 VUE 项目，可以在 `main.js` 中引入。

```js
// main.js
import ezAxios from 'ez-axios';

ezAxios({
  baseURL: '', // 基础地址
  mark: '', // 标记
  timeout: 30000, // 请求超时时间
  briefly: true, // 简要数据结构
  loading: true, // 是否显示加载动画
  headers: {}, // 请求头
  error: status => {} // 错误处理
  success: undefined // 成功处理（1.1.0 新增），response => {}
});

// 全局配置项均为非必填，以上值为内置默认值。
```

### AloneSet（1.1.1 新增）

> ez-axios 提供了 `AloneSet` 方法类，可以更灵活的对全局的某一项进行修改。

```js
import { AloneSet } from 'ez-axios';

AloneSet.header = {
  token: 'k7r+vB0fj+dqxcRF3ts9G7E+K191C'
};
AloneSet.loading = false;
```

## 请求方法参数说明

> `ez-axios` 在封装了 `get`、`post`、`put`、`del` 四种常用的请求方法，可以根据需求选择使用。如果你苦恼于看文档，可以尝试在引用时，配合注释提示，快速了解每一个参数的含义。

- 前两个参数只能是**请求地址**，**请求参数**（参数值仅支持：`Object`、`Array`、`File`）。

- 可以指定`请求参数类型`、`返回值类型`。
  - 请求参数类型（`requestType`）可用值（`get` 请求无法指定）：`json`、`query`、`form-data`/`formdata`/`data`、`file`。

  - 返回值类型（`responseType`）可用值：`blob`（多用于文件、下载），若不指定，则默认返回。

  - `requestType`、`responseType`：可同时指定，如：`post('/url',{name: 'test'},'query','blob')`。

### json、query、form-data

> `json`、`query`、`form-data` 三种请求参数类型，`ez-axios` 会自动处理，无需手动设置请求头。

```js
// json
get('/user/login', { name: 'test' }, 'json');

// query
get('/user/login', { name: 'test' }, 'query');

// form-data
post('/user/login', { name: 'test' }, 'form-data');
```

### 文件上传

> 实际应用中，上传文件是十分常见业务场景，使用`ez-axios`可快速处理文件对象，实现上传功能。

```js
const api = {
  file: (par: any): Promise<any> => post('/user/login', par, 'file')
};

// 文件上传测试;
const fileList = [
  new File(['123'], '123.txt', { type: 'text/plain' }),
  new File(['456'], '456.txt', { type: 'text/plain' })
];

// 例1: json + file
api.file({ username: 'test', password: '123456', fileList }).then(res => {
  console.log('File Response:', res);
});

// 例2：file 对象
api.file({ file1: fileList[0], file2: fileList[1] }).then(res => {
    console.log('File Response:', res);
});

// 例3：file 数组
api.file(fileList).then(res => {
    console.log('File Response:', res);
});
```

### 文件下载

> `ez-axios` 设置，返回值类型为 `blob`，即可快速下载文件。

```js
const api = {
  download: (par: any): Promise<any> => get('https://fastly.picsum.photos/id/323/400/300.jpg?hmac=2EbkxdMp9KT6S3wGeqfaU_VnIMkzCzZFULpOD6M_0Po', par, 'blob')
};

api.download().then((res: any) => {
  if (res instanceof Blob) {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    const blobUrl = window.URL.createObjectURL(res);
    aLink.download = '400x300.jpg';
    aLink.href = blobUrl;
    aLink.click();
    document.body.removeChild(aLink);
  } else {
    // 参数不配置 'blob' 时，则无法正确下载
    console.error('请确认下载类型');
  }
});

```

### 自定义设置

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

- 配置`mark`后，请求`Url`若以`mark`开头，则标记会被删除

  ```js
  ezAxios({
    mark: 'api' // 标记
  });

  get('/api/url'); // 发起请求时，/api 会被删除，请求地址会变为：/url
  ```

  > 此配置多用于处理代理标记，可根据当前环境信息，设置不同的标记

  ```js
  // 例1：
  ezAxios({
    mark: process.env.NODE_ENV === 'production' ? 'api' : ''
  });

  // 例2：
  ezAxios({
    mark: import.meta.env.MODE === 'production' ? ['api', 'test', 'mock'] : ''
  });
  ```

- 从第三个参数开始，后面的参数均为**可选参数**，**不限制顺序**，**不区分大小写**。

## 手动取消（1.1.0 新增）

> `ez-axios` 支持手动取消，但无法全局配置，仅针对单个请求取消，使用方式如下：

```js
const api = {
  login: (par: any, par1?: any): Promise<any> => get('/user/login', par, par1)
};

// 重复请求
api.login({ username: 'test', password: '123456' }).then(res => {
  console.log('Login Response1:', res);
});
// 手动取消
const controller = new AbortController(); // 创建一个控制器
api
  .login(
    { username: 'test', password: '123456' },
    {
      signal: controller.signal // 传递控制器
    }
  )
  .then(res => {
    console.log('Login Response3:', res);
  });
controller.abort();  // 取消请求
```

## 后续优化方向

- 切片、断点续传

- 请求进度条

- （自动）请求重试
