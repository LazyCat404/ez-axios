import { AxiosResponse } from 'axios';

export interface ezAxiosOptions {
  baseURL: string; // 基础地址
  mark: string | Array<string>; // 代理标记
  timeout: number; // 请求超时时间
  briefly: boolean; // 简要数据结构
  loading: boolean; // 是否显示加载动画
  headers: Record<string, string | undefined | null>; // 请求头
  /*eslint no-unused-vars:*/
  error: (status: number) => void; // 错误处理
  success: (response: AxiosResponse) => void; // 请求拦截
}

// 默认配置
const defaultOptions: ezAxiosOptions = {
  baseURL: '',
  mark: '',
  timeout: 30000,
  briefly: true,
  loading: true,
  headers: {},
  error: errorHandling,
  success: () => {}
};

// 自定义配置
export let globalOptions: ezAxiosOptions = defaultOptions;

/**
 * @description ez-axios 全局配置（建议只在项目入口文件调用一次）
 * @param options
 */
export default (options?: Partial<ezAxiosOptions>): void => {
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

/**
 * @description ez-axios 更灵活的单项设置
 */
export class AloneSet {
  /**
   * @description 设置全局基础地址
   * @param baseURL
   */
  static baseURL(baseURL: string) {
    globalOptions.baseURL = baseURL;
  }
  /**
   * @description 设置全局代理标记
   * @param mark
   */
  static mark(mark: string | Array<string>) {
    globalOptions.mark = mark;
  }
  /**
   * @description 设置全局请求超时时间
   * @param timeout
   */
  static timeout(timeout: number) {
    globalOptions.timeout = timeout;
  }
  /**
   * @description 设置全局简要数据结构
   * @param briefly
   */
  static briefly(briefly: boolean) {
    globalOptions.briefly = briefly ? true : false;
  }
  /**
   * @description 设置全局加载动画
   * @param loading
   */
  static loading(loading: boolean) {
    globalOptions.loading = loading ? true : false;
  }
  /**
   * @description 设置全局请求头
   * @param headers
   */
  static header(headers: Record<string, string>) {
    if (Object.prototype.toString.call(headers) == '[object Object]') {
      for (const key in headers) {
        if (typeof headers[key] == 'string') {
          globalOptions.headers[key] = headers[key];
        } else {
          globalOptions.headers[key] = headers[key] + '';
          console.warn('ezAxios: header 参数类型错误，已为您强制类型转换，但这可能不是你想要的。');
        }
        // 删除空值
        if (!globalOptions.headers[key]) {
          delete globalOptions.headers[key];
        }
      }
    } else {
      console.error('ezAxios: header 参数类型错误');
    }
  }
  /**
   * @description 设置全局错误处理
   * @param error
   */
  static error(error: (status: number) => void) {
    globalOptions.error = error;
  }
  /**
   * @description 设置全局请求拦截
   * @param success
   */
  static success(success: (response: AxiosResponse) => void) {
    globalOptions.success = success;
  }
}
