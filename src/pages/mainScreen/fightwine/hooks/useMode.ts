//获取可选模式
//allMode 所有酒局模式
//selectableMode 我的酒局模式（可选）

import { useRequest } from 'ahooks';
import { selectableMode } from '@api/fightwine';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default <T>(url: string = 'allMode', list: any[]) => {
  const [modeList, setModeList] = useState<T>([]);
  const { t } = useTranslation()
  useRequest(() => selectableMode(url), {
    onSuccess: (res) => {
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
