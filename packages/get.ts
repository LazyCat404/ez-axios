import ezAxios from './ezAxios';

/**
 * @description get 方法，对应 get 请求
 * @param { String } url 接口地址
 * @param { Record<string, string> | Array } params [请求参数]：只能作为第二个参数
 * @param { String } responseType [返回值类型]：（多用于下载）blob
 * @param { ezAxiosOptions } customOptions [自定义设置]：不可作为前两个参数，会覆盖全局配置
 * @returns get 请求的 Promise 处理
 */
export default function get(url: string, ...theArgs: any[]): Promise<any> {
  // 参数处理
  let params: any = null;
  let responseType: any = 'json';
  let customOptions: any = null;
  if (theArgs.length) {
    theArgs.forEach((item: any, i: number) => {
      if (i === 0) {
        if (typeof item == 'object') {
          params = item;
        } else if (typeof item == 'string') {
          if (item.toLowerCase() === 'blob') {
            responseType = 'blob';
          } else {
            console.error('请求参数仅支持 Object、Array类型');
          }
        } else {
          if (params) {
            console.error('请求参数仅支持 Object、Array类型');
          }
        }
      } else if (i < 3) {
        if (Object.prototype.toString.call(item) == '[object Object]') {
          customOptions = item;
        } else if (typeof item == 'string') {
          if (item.toLowerCase() === 'blob') {
            responseType = 'blob';
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
    ezAxios(customOptions)
      .get(url, { params, responseType })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
