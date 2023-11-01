import { reactive } from 'vue';
import axios from 'axios';

const enterprise = reactive({
  name: '',
  home: 'https://le5le.com',
  account: location.protocol + '//' + location.host + '/account',
  v: location.protocol + '//' + location.host + '/v',
  '3d': location.protocol + '//' + location.host + '/3d',
  '2d': location.protocol + '//' + location.host + '/2d',
  admin: location.protocol + '//' + location.host + '/admin',
  helps: [
    {
      name: '产品介绍',
      url: 'https://doc.le5le.com/document/118756411',
    },
    {
      name: '快速上手',
      url: 'https://doc.le5le.com/document/119363000',
    },
    {
      name: '使用手册',
      url: 'https://doc.le5le.com/document/118764244',
    },
    {
      name: '快捷键',
      url: 'https://doc.le5le.com/document/119620214',
      divider: true,
    },
    {
      name: '企业服务与支持',
      url: 'https://doc.le5le.com/document/119296274',
      divider: true,
    },
    {
      name: '关于我们',
      url: 'https://le5le.com/about.html',
    },
  ],
});

export const useEnterprise = () => {
  const getEnterprise = async () => {
    // 官网或安装包版本
    if (import.meta.env.VITE_TRIAL != 1) {
      return;
    }

    // 企业版
    const ret = await axios.get('/api/enterprise');
    if (ret) {
      Object.assign(enterprise, ret);
    }
  };

  return {
    enterprise,
    getEnterprise,
  };
};
