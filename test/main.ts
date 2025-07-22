import ezAxios, { post, del, put, get } from '../packages/index';

ezAxios({
  // baseURL: 'http://localhost:3000'
  baseURL: 'http://rap2api.taobao.org/app/mock/307564'
});

const api = {
  login: (par: any, par1?: any): Promise<any> => post('/user/login', par, par1)
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
// controller.abort(); // 取消请求
