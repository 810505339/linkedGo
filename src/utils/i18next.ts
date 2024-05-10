
import i18next, { ModuleType, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import storage from '@storage/index';
import * as en from '@locales/en-US';
import * as zh from '@locales/zh-CN';
import { getLocales } from 'react-native-localize';
import { loadLanguageStorage } from '@storage/language/action';


const files = require.context('../pages', true, /i18n\/.*\.ts$/);
let enTarget = en;
let zhTarget = zh;
files.keys().forEach((key: string) => {
  //判断是英文还是中文
  if (key.includes('en-US')) {
    enTarget = Object.assign(enTarget, files(key).default);
  }
  if (key.includes('zh-CN')) {
    zhTarget = Object.assign(zhTarget, files(key).default);

  }

});

const resources: Resource = {
  en: {
    translation: enTarget,
  },
  zh: {
    translation: zhTarget,
  },
};



const languageDetector = {
  type: 'languageDetector' as ModuleType,
  async: true,
  detect: async function (callback) {
    // 获取上次选择的语言


    // const lng = await storage.load({ key: lngKey });
    // if (lng === 'locale') {
    //   callback(getSystemLanguage());
    // } else {
    //   callback(lng);
    // }
  },
};

// 初始化i18next配置
i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en', // 切换语言失败时的使用的语言
    debug: __DEV__, // 开发环境开启调试
    lng: getLocales()[0].languageCode,
    // 资源文件
    resources: resources,
    react: {
      useSuspense: false,
    },
  });

/**
 * 获取当前系统语言
 * @returns
 */
export const getSystemLanguage = (): string => {
  const locales = getLocales();
  return locales[0].languageCode;
};

/**
 * 切换语言
 * @param lng
 */
export const changeLanguage = async () => {
  // 判断是否选择过语言

  try {
    const { language } = await loadLanguageStorage();
    console.log(language);

    await i18next.changeLanguage(language);
  } catch (error) {
    console.log(error);
    await i18next.changeLanguage(getSystemLanguage());
  }

};


export const changeLanguageBySys = async (lng: string) => {

  await i18next.changeLanguage(lng);
}


export default i18next;
