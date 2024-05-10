import { getLocales } from 'react-native-localize';
import storage from '../index';
import { LANGUAGE } from './key';


/* language
   en,
   cn
*/
const saveLanguageStorage = async (language: string) => {
  await storage.save({
    key: LANGUAGE,
    data: {
      language: language,
    },
  });
};

const loadLanguageStorage = async () => {
  const systemLanguage = getLocales()[0].languageCode;
  let res = {
    language: systemLanguage,
  };

  try {
    res = await storage.load({
      key: LANGUAGE,
    });

  } catch (e) {
  }



  return new Promise((resolve) => {
    resolve(res);
  })
};
export {
  saveLanguageStorage,
  loadLanguageStorage,
};
