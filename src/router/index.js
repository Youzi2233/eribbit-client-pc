import { createRouter, createWebHashHistory } from 'vue-router';

const Layout = () => import('@/views/Layout');
const Home = () => import('@/views/home');
const TopCategory = () => import('@/views/category/index');
const SubCategory = () => import('@/views/category/sub');
const Goods = () => import('@/views/goods/index');

// 路由规则
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
    ],
  },
];

// vue2.0 new VueRouter({})
// vue3.0 new createRouter({})
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
});

export default router;
