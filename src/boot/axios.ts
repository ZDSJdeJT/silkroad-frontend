import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { defaultLanguage } from 'src/i18n';
import { i18n } from 'src/boot/i18n';
import { Notify } from 'quasar';
import { router } from 'src/router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: '/api/v1' });

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.headers = config.headers ?? {};
    config.headers['Accept-Language'] =
      localStorage.language ?? defaultLanguage;
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response.data;
  },
  async (error) => {
    // Do something with response error
    if (error.response.data instanceof Blob) {
      const text = await error.response.data.text();
      error.response.data = JSON.parse(text);
    }
    Notify.create({
      message:
        error.response.data.message ?? i18n.global.t('errors.unknownError'),
      position: 'top',
      type: 'negative',
    });
    if (error.response.statusText === 'Unauthorized') {
      router.push({ name: 'AdminLogin' });
    } else if (error.response.statusText === 'Internal Server Error') {
      router.push({ name: 'InternalServerError' });
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
