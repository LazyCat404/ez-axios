import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { globalOptions, ezAxiosOptions } from './ezAxiosConfig';
import Loading from './Loading';

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map();

/**
 * @description 自定义 axios 请求对象
 * @param { ezAxiosOptions } customOptions 自定义配置
 * @returns axios 实例
 */
export default function ezAxios(customOptions?: ezAxiosOptions): AxiosInstance {
  // 将全局选项和自定义选项合并
  const targetOptions: ezAxiosOptions = Object.assign(globalOptions, customOptions);
  // 创建一个简易的axios实例
  const ezAxios = axios.create({
    timeout: targetOptions.timeout,
    baseURL: targetOptions.baseURL
  });
  // http request 请求拦截
  ezAxios.interceptors.request.use(
    config => {
      // 如果有loading选项，则显示loading
      if (targetOptions.loading) {
        Loading.show();
      }
      removePending(config); // 在请求开始前，对之前的请求做检查取消操作
      addPending(config); // 将当前请求添加到 pending 中
      // 设置请求头
      for (const key in targetOptions.headers) {
        config.headers[key] = targetOptions.headers[key];
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  // http response 响应拦截
  ezAxios.interceptors.response.use(
    (response: AxiosResponse) => {
      Loading.close();
      removePending(response.config); // 在请求结束后，移除本次请求
      return Promise.resolve(targetOptions.briefly ? response.data : response);
    },
    error => {
      Loading.close();
      if (error.response) {
        if (targetOptions.error) {
          targetOptions.error(error.response.status);
        }
        return Promise.reject(error.response);
      } else {
        return Promise.reject(error.message);
      }
    }
  );
  return ezAxios;
}

/**
 * @description 添加请求
 * @param { Object } config AxiosRequestConfig
 */
function addPending(config: AxiosRequestConfig) {
  const key = pendingKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      // 如果 pending 中不存在当前请求标识
      if (!pending.has(key)) {
        // 将改请求标识添加到 pending 中
        pending.set(key, cancel);
      }
    });
}

/**
 * @description 移除请求
 * @param { Object } config  AxiosRequestConfig
 */
function removePending(config: AxiosRequestConfig) {
  const key = pendingKey(config);
  // pending 中存在当前请求key
  if (pending.has(key)) {
    // 取消请求
    const cancelToken = pending.get(key);
    cancelToken(key);
    // 在 pending 中移除这个标识
    pending.delete(key);
  }
}

/**
 * @description 为每个请求生成唯一标识key；当请求方式（method）、请求路径（url）、请求参数（params/data）都相同时，视为同一个请求
 * @param { * } config
 * @returns 唯一标识
 */
function pendingKey(config: AxiosRequestConfig) {
  const { url, method, params } = config;
  let { data } = config;
  try {
    JSON.parse(data);
    data = JSON.parse(data);
  } catch (err) {}

  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}
