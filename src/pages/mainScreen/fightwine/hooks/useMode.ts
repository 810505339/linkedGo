//获取可选模式
//allMode 所有酒局模式
//selectableMode 我的酒局模式（可选）

import { useRequest } from 'ahooks';
import { selectableMode } from '@api/fightwine';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

let defaultlanguage = ''

export default <T>(url: string = 'allMode', list: any[]) => {
  const [modeList, setModeList] = useState<T>([]);
  const { t, i18n } = useTranslation()

  useEffect(() => {
    run()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (i18n.language !== defaultlanguage) {
        defaultlanguage = i18n.language
        run()
      }
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [i18n.language])
  )
  const { run } = useRequest(() => selectableMode(url), {
    manual: true,
    onSuccess: (res) => {

      console.log(res, 'res')
      let temp = res.data.map(d => {
        const index = list.findIndex(l => d.winePartyMode === l.winePartyMode);
        if (~index) {
          return {
            ...list[index],
            ...d,
          };
        }
      });
      if (url === 'allMode') {
        temp = [{ modeName: t('mywineparty.mode1'), winePartyMode: '' }, ...temp]
      }


      setModeList(temp);

    },
  });
  return {
    modeList,
  };
};
