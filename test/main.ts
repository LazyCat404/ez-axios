import ezAxios, { post, del, put, get } from '../packages/index';

ezAxios({
  // baseURL: 'http://localhost:3000'
  baseURL: 'http://rap2api.taobao.org/app/mock/307564'
});

const controller = new AbortController();

const api = {
  login: (par: any, par1?: any): Promise<any> => post('/user/login', par, par1)
};

api.login({ username: 'test', password: '123456' }).then(res => {
  console.log('Login Response1:', res);
});

api.login({ username: 'test', password: '123456' }).then(res => {
  console.log('Login Response2:', res);
});

api
  .login(
    { username: 'test', password: '123456' },
    {
      signal: controller.signal
    }
  )
  .then(res => {
    console.log('Login Response3:', res);
  });
controller.abort(); // 手动取消
