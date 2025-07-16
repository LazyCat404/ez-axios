import ezAxios from './ezAxios';

/**
 * @description del 方法，对应 delete 请求
 * @param { String } url 接口地址
 * @param { Record<string, string> | Array } params [请求参数]：只能作为第二个参数
 * @param { String } requestType [请求参数类型]：json（默认）、query
 * @param { ezAxiosOptions } customOptions [自定义设置]：不可作为前两个参数，会覆盖全局配置
 * @returns delete 请求的 Promise 处理
 */
export default function del(url: string, ...theArgs: any[]): Promise<any> {
  // 参数处理
  let params: any = null;
  let requestType: any = null;
  let customOptions: any = null;
  if (theArgs.length) {
    theArgs.forEach((item, i) => {
      if (i === 0) {
        if (typeof item == 'object') {
          params = item;
        } else if (typeof item == 'string') {
          if (item.toLowerCase() === 'query' || item.toLowerCase() === 'json') {
            requestType = item.toLowerCase();
          } else {
            console.error('请求参数仅支持 Object、Array 类型');
          }
        } else {
          if (params) {
            console.error('请求参数仅支持 Object、Array 类型');
          }
        }
      } else if (i < 3) {
        if (Object.prototype.toString.call(item) == '[object Object]') {
          customOptions = item;
        } else if (typeof item == 'string') {
          if (item.toLowerCase() === 'query' || item.toLowerCase() === 'json') {
            requestType = item.toLowerCase();
          } else {
            console.warn('存在无法处理的参数类型，这可能会影响您的程序');
          }
        } else {
          console.warn('存在无法处理的参数类型，这可能会影响您的程序');
        }
      } else {
        console.warn('接收到多余参数，已忽略');
      }
    });
  }
  return new Promise((resolve, reject) => {
    if (requestType === 'query') {
      ezAxios(customOptions)
        .delete(url, { params })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    } else {
      ezAxios(customOptions)
        .delete(url, { data: params })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}
