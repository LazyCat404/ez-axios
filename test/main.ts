import ezAxios, { post } from '../packages/index';

sessionStorage.removeItem('token');
ezAxios({
  baseURL: 'http://rap2api.taobao.org/app/mock/307564'
});

const api = {
  login1: (par: any): Promise<any> => post('/user/login', par), // 默认: json
  login2: (par: any): Promise<any> => post('/user/login', par, 'query'),
  login3: (par: any): Promise<any> => post('/user/login', par, 'form-data')
};

api.login1({ username: 'test', password: '123456' }).then(res => {
  console.log('Login Response1:', res);
});
api.login2({ username: 'test', password: '123456' }).then(res => {
  console.log('Login Response2:', res);
});
api.login3({ username: 'test', password: '123456' }).then(res => {
  console.log('Login Response3:', res);
});
