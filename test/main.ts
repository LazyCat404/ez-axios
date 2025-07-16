import ezAxios, { post } from '../packages/index';

ezAxios({
  baseURL: 'http://localhost:3000'
});

const api = {
  login: (par: any): Promise<any> => post('/user/login', par)
};

api.login({ username: 'test', password: '123456' }).then(res => {
  console.log('Login Response:', res);
});
