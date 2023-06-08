import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages, { defaultLanguage } from 'src/i18n';

export const i18n = createI18n({
  locale: defaultLanguage,
  legacy: false,
  messages,
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});
