import axios from 'axios';
import store from '@/store';
import router from '@/router';

// 1. 创建一个新的axios实例
// 2. 请求拦截器，如果有token，则进行头携带
// 3. 响应拦截器： 1. 剥离无效数据 2.处理token失效
// 4. 导出一个函数，调用当前的axios实例发请求，返回值是一个promise

// 导出基准地址，原因：其他地方不熟通过axios发请求的地方用上基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/';
const instance = axios.create({
  // axios的一些配置
  baseURL,
  timeout: 15000,
});

instance.interceptors.request.use(
  // 拦截业务逻辑
  // 进行请求配置的修改
  // 如果本地有token就在头部携带
  // 1. 获取用户信息对象
  config => {
    const { profile } = store.state.user;
    // 判断是否有token
    if (profile.token) {
      // 设置token
      config.headers.Authorization = `Bearer ${profile.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  res => {
    return res.data;
  },
  err => {
    //   401状态码，进入该函数
    if (err.response && err.response.status === 401) {
      //  1. 清空无效用户信息
      // 2. 跳转到登录页码
      // 3. 跳转需要传参（当前路由地址）给登录页码
      store.commit('user/setUser', {});
      //  encodeURIComponent 转换url编码，防止特殊符号出现问题，这个浏览器认识的
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath);
      router.push('/login?redirectUtl=' + fullPath);
    }
    return Promise.reject(err);
  }
);

// 请求工具函数
const request = (url, method, submitData) => {
  // 负责发请求： 请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 如果是get请求，需要使用params来传递submitData
    // 如果不是get请求，需要使用data来传递submitData
    // [] 设置一个动态的key，写js表达式，js表达式的执行结果当作KEY
    // methos参数：get，Get,GET
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData,
  });
};

export default request;
