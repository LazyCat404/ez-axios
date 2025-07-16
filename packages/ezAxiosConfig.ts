export interface ezAxiosOptions {
  timeout?: number; // 请求超时时间
  briefly?: boolean; // 简要数据结构
  baseURL?: string; // 基础地址
  loading?: boolean; // 是否显示加载动画
  headers?: Record<string, string>; // 请求头
  /*eslint no-unused-vars:*/
  error?: (status: number) => void; // 错误处理
}

// 默认配置
const defaultOptions: ezAxiosOptions = {
  baseURL: '',
  timeout: 30000,
  briefly: true,
  loading: true,
  headers: {},
  error: errorHandling
};

// 自定义配置
export let globalOptions: ezAxiosOptions = defaultOptions;

/**
 * ez-axios 全局配置
 * @param options
 */
export default (options: ezAxiosOptions): void => {
  globalOptions = Object.assign(defaultOptions, options);
};

/**
 * @description http response 错误处理
 * @param { Number } status 状态码
 */
function errorHandling(status: number) {
  switch (status) {
    case 404:
      console.error('网络请求不存在');
      break;
    case 401:
      console.error('401 未授权');
      break;
    case 500:
      console.error('服务器遇到错误，无法完成请求');
      break;
    default:
      console.error('通用错误');
  }
}
