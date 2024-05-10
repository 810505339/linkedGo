import { useEffect } from 'react';
import { getLocales } from 'react-native-localize';
import { changeLanguage, changeLanguageBySys } from '@utils/i18next';
//自动转换语言
export default function () {

  useEffect(() => {
    changeLanguage()
  }, [])

}
