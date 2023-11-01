import { MessagePlugin } from 'tdesign-vue-next';
import axios from 'axios';
import { getCookie } from '@/services/cookie';

// axios 配置
axios.defaults.timeout = 60000;
axios.defaults.withCredentials = false;

// http request 拦截器
axios.interceptors.request.use(
  (config: any) => {
    config.headers.Authorization =
      'Bearer ' + (localStorage.token || getCookie('token') || '');

    return config;
  },
  (err: any) => Promise.reject(err)
);

// http response 拦截器
axios.interceptors.response.use(
  (response: any) => {
    if (response && response.data && response.data.error) {
      MessagePlugin.error(response.data.error);
      return;
    }
    if (response) {
      return response.data;
    }
    return;
  },
  async (error: any) => {
    if (error && !error.response) {
      return;
    }
    if (error && error.response) {
      if (error.response.config.url === '/api/account/profile') {
        return;
      }

      if (
        error.response.status !== 401 &&
        error.response.status !== 402 &&
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        MessagePlugin.error(error.response.data.error);
        return;
      }

      switch (error.response.status) {
        case 403:
          MessagePlugin.error('请求错误，不合法的请求！');
          break;
        case 404:
          if (error.response.config.url.indexOf('/data/') !== 0) {
            MessagePlugin.error('访问数据不存在，请检查后重试！');
          }
          break;
        case 500:
          MessagePlugin.error('请求服务错误，请稍后重试！');
          break;
        case 504:
          MessagePlugin.error('网络超时，请检测你的网络！');
          break;
        default:
          MessagePlugin.error('未知网络错误！');
          break;
      }
    }
    // return error.response ? error.response.data : error;
  }
);

export default axios;
