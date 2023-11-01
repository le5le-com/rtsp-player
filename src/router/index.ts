import { createRouter, createWebHistory } from 'vue-router';

const routes = [{ path: '/', component: () => import('@/views/Index.vue') }];

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL[0] === '/' ? import.meta.env.BASE_URL : '/'
  ),
  routes,
});

export default router;
