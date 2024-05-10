import {useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import * as eva from '@eva-design/eva';
//自动转换语言
export default function () {
  //获取系统主题
  const colorScheme = Appearance.getColorScheme();
  const [sysTheme, setSysTheme] = useState(colorScheme);

  useEffect(() => {
    setSysTheme(colorScheme);
  }, [colorScheme]);

  const theme = sysTheme === 'dark' ? eva.dark : eva.light;
  return {
    theme,
  };
}
