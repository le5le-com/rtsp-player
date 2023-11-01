import { reactive } from 'vue';

import axios from 'axios';
import dayjs from 'dayjs';

import { updateObject } from '@/services/object';
import router from '@/router';
import { deleteCookie, setCookie } from '@/services/cookie';

export interface IUser {
  id?: string;
  account?: string;
  phone?: string;
  email?: string;
  password?: string;
  rePassword?: string;
  username?: string;
  avatarUrl?: string;
  role?: string;
  token?: string;
  inviteCode?: string;
  code?: string;
  remember?: boolean;
  captcha?: string;
  vip?: string;
  vipExpired?: boolean;
  roles?: string[];
  isOperation?: boolean;
  company?: any;
  department?: any;
  corporation?: any;
  teams?: { id: string; name: string }[];
  wechat?: any;
  sina?: any;
  github?: any;
  created?: any;
  createdAt?: any;
}

const user = reactive<IUser>({
  id: '',
});

const message = reactive<{ unread: number }>({
  unread: 0,
});

export const useUser = () => {
  const getUser = async (token?: boolean) => {
    const params: any = {};
    if (token) {
      if (localStorage.getItem('remember')) {
        params.token = 'r';
      } else {
        params.token = '1';
      }
    }
    const ret: IUser = await axios.get('/api/account/profile', { params });
    if (!ret) {
      return;
    }
    setUser(ret);

    return user;
  };

  const getMessage = async () => {
    const ret: { unread: number } = await axios.post(
      '/api/message/unread/count'
    );
    ret && (message.unread = ret.unread);
  };

  const setUser = async (data: IUser) => {
    if (data.vip) {
      const vip = new Date(data.vip);
      if (vip > new Date()) {
        data.vipExpired = false;
      } else if (vip > new Date('2023-01-17T08:00:00+08:00')) {
        data.vipExpired = true;
      } else {
        data.vip = undefined;
      }
      if (data.vip) {
        data.vip = dayjs(data.vip).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    if (data.roles) {
      for (const item of data.roles) {
        if (item.indexOf('运营') > -1) {
          data.isOperation = true;
          break;
        }
      }
    }
    data.created = dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss');

    if (data.token) {
      if (import.meta.env.BASE_URL[0] === '/') {
        localStorage.setItem('token', data.token);
      } else {
        setCookie('token', data.token, {
          path: '/',
          domain: getRootDomain(),
        });
        localStorage.removeItem('token');
      }
      delete data.token;
    }
    updateObject(user, data);
  };

  const signout = () => {
    updateObject(user, {});
    localStorage.removeItem('token');
    const domain = getRootDomain();
    if (domain) {
      deleteCookie('token', {
        path: '/',
        domain: getRootDomain(),
      });
    }

    router.replace({ path: '/login', query: router.currentRoute.value.query });
  };

  const getRootDomain = () => {
    let domain = '';
    const domainItems = document.domain.split('.');
    if (
      domainItems.length < 3 ||
      (domainItems.length === 4 &&
        +domainItems[0] > 0 &&
        +domainItems[1] > 0 &&
        +domainItems[2] > 0 &&
        +domainItems[3] > 0)
    ) {
      domain = '';
    } else if (
      document.domain.endsWith('.com.cn') ||
      document.domain.endsWith('.org.cn')
    ) {
      domain = domainItems.slice(-3).join('.');
    } else {
      domain = domainItems.slice(-2).join('.');
    }

    return domain;
  };

  return {
    user,
    message,
    getUser,
    getMessage,
    setUser,
    signout,
  };
};
