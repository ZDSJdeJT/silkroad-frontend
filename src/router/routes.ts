import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/admin',
        name: 'Admin',
        redirect: {
          name: 'AdminConsole',
        },
      },
      {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('pages/admin/LoginPage.vue'),
      },
      {
        path: '/admin/console',
        name: 'AdminConsole',
        component: () => import('pages/admin/ConsolePage.vue'),
      },
      {
        path: '/not-found',
        name: 'NotFound',
        component: () => import('layouts/ErrorLayout.vue'),
        props: {
          statusCode: 404,
          statusText: 'errors.notFound',
        },
      },
      {
        path: '/internal-server-error',
        name: 'InternalServerError',
        component: () => import('layouts/ErrorLayout.vue'),
        props: {
          statusCode: 500,
          statusText: 'errors.internalServerError',
        },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'NotFound',
    },
  },
];

export default routes;
