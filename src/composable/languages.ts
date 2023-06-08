import { useI18n } from 'vue-i18n';
import { Languages } from 'src/enums';
import zhCN from 'quasar/lang/zh-CN';
import enUS from 'quasar/lang/en-US';
import { useQuasar } from 'quasar';

export const useLanguages = () => {
  const $q = useQuasar();
  const i18n = useI18n({ useScope: 'global' });
  return {
    $q,
    i18n,
    setLanguage: (language: Languages) => {
      i18n.locale.value = language;
      document.title = i18n.t('meta.title');
      document.documentElement.lang = language;
      switch (language) {
        case 'en-US':
          $q.lang.set(enUS);
          localStorage.language = language;
          break;
        default:
          $q.lang.set(zhCN);
          localStorage.removeItem('language');
      }
    },
  };
};
