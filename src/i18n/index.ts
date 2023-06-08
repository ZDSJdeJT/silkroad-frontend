import enUS from './en-US';
import zhCN from './zh-CN';
import { Languages } from 'src/enums';

export const defaultLanguage = Languages['zh-CN'];

export default {
  [Languages['zh-CN']]: zhCN,
  [Languages['en-US']]: enUS,
};
