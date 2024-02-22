import { reactive } from 'vue';

const enterprise = reactive({
  name: '',
  home: 'https://le5le.com',
  helps: [
    {
      name: '使用文档',
      url: 'https://doc.le5le.com/document/119363000',
      divider: false,
    },
    {
      name: '关于我们',
      url: 'https://le5le.com',
      divider: false,
    },
  ],
});

export const useEnterprise = () => {
  return {
    enterprise,
  };
};
