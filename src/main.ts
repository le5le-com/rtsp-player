import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import App from './App.vue';
import router from './router';
import '@/http';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zh from 'dayjs/locale/zh-cn';

import './styles/variables.css';
import './styles/index.css';
import 'tdesign-vue-next/es/style/index.css';
import './styles/ui.css';

dayjs.extend(relativeTime);
dayjs.locale(zh.name);

const app = createApp(App).use(router).use(TDesign);
app.mount('#app');
