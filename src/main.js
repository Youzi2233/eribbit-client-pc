import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './mock/index';

// 导入自己的UI组件库
import UI from '@/components/library';

// 1. 重置样式的库
import 'normalize.css';
// 2.自己项目的重置样式
import '@/assets/styles/common.less';

createApp(App).use(store).use(router).use(UI).mount('#app');
