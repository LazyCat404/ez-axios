import ezAxios from './ezAxios';
import QS from 'qs';

/**
 * @description post 方法，对应 post 请求
 * @param { String } url 接口地址
 * @param { Record<string, string> | Array | File } params [请求参数]：只能作为第二个参数
 * @param { String } requestType [请求参数类型]：json（默认）、query、file、data
 * @param { String } responseType [返回值类型]：（多用于下载）blob，请参数类型为query时失效
 * @param { ezAxiosOptions } customOptions [自定义设置]：不可作为前两个参数，会覆盖全局配置
 * @returns post 请求的 Promise 处理
 */
export default function post(url: string, ...theArgs: any[]): Promise<any> {
  // 参数处理
  let params: any = null;
  let requestType: any = null;
  let responseType: any = 'json';
  let customOptions: any = null;
  if (theArgs.length) {
    theArgs.forEach((item, i) => {
      if (i === 0) {
        if (typeof item == 'object') {
          params = item;
        } else if (typeof item == 'string') {
          if (item.toLowerCase() === 'blob') {
            responseType = 'blob';
          } else if (
            item.toLowerCase() === 'json' ||
            item.toLowerCase() === 'query' ||
            item.toLowerCase() === 'file' ||
            item.toLowerCase() === 'data' ||
            item.toLowerCase() === 'form-data' ||
            item.toLowerCase() === 'formdata'
          ) {
            requestType = item.toLowerCase();
          } else {
            console.error('请求参数仅支持 Object、Array、File 类型');
          }
        } else {
          if (params) {
            console.error('请求参数仅支持 Object、Array、File 类型');
          }
        }
      } else if (i < 4) {
        if (Object.prototype.toString.call(item) == '[object Object]') {
          customOptions = item;
        } else if (typeof item == 'string') {
          if (item.toLowerCase() === 'blob') {
            responseType = 'blob';
          } else if (
            item.toLowerCase() === 'json' ||
            item.toLowerCase() === 'query' ||
            item.toLowerCase() === 'file' ||
            item.toLowerCase() === 'data' ||
            item.toLowerCase() === 'form-data' ||
            item.toLowerCase() === 'formdata'
          ) {
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
    // 提示
    if (responseType != 'json' && requestType == 'query') {
      console.warn('请参数类型为query时，设置返回值类型无效');
    }
  }
  return new Promise((resolve, reject) => {
    if (requestType === 'query') {
      ezAxios(customOptions)
        .post(url, null, { params })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    } else if (requestType === 'file') {
      const formData = new FormData();
      if (params instanceof File) {
        formData.append(`file`, params);
      } else {
        for (const item in params) {
          if (params[item] instanceof File) {
            formData.append(`${item}`, params[item]);
          } else if (Object.prototype.toString.call(params[item]) == '[object Array]') {
            const fileList = params[item].filter((el: any) => el instanceof File);
            if (fileList.length && fileList.length <= params[item].length) {
              fileList.forEach((file: File, i: number) => {
                formData.append(`${item}[${i}]`, file);
              });
              if (fileList.length < params[item].length) {
                console.warn(`数组${item}存在非文件类型对象，已被忽略`);
              }
            } else {
              formData.append(`${item}`, JSON.stringify(params[item]));
            }
          } else if (typeof params[item] == 'string') {
            formData.append(`${item}`, params[item]);
          } else {
            formData.append(`${item}`, JSON.stringify(params[item]));
          }
        }
      }
      ezAxios(customOptions)
        .post(url, formData, { responseType })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    } else if (requestType === 'data' || requestType === 'form-data' || requestType === 'formdata') {
      ezAxios(customOptions)
        .post(url, QS.stringify(params), { responseType })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    } else {
      ezAxios(customOptions)
        .post(url, params, { responseType })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}
