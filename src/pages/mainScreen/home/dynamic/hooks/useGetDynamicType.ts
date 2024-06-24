import uuid from 'react-native-uuid';
import { useRequest } from 'ahooks';
import { getDynamicTypeByStoreId } from '@api/dynamic';
import useSelectShop from '@hooks/useSelectShop';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadLanguageStorage } from '@storage/language/action'

type DynamicTypeList = {
  // name: string,
  // id: string,
  // isAll?: boolean
}

export default (): { dynamicTypeList: Array<DynamicTypeList>, storeId: string } => {
  const { shop } = useSelectShop();
  const { t } = useTranslation();
  const [data, setData] = useState([])
  console.log(shop.select.id, 'shop.select.id');


  const { run } = useRequest(() => getDynamicTypeByStoreId(shop.select.id), {
    manual: true,
    onSuccess: async (res) => {
      const { language } = await loadLanguageStorage();
      if (res.success) {
        setData(() => {
          return (res?.data?.map((item) => {
            return {
              ...item,
              name: language == 'en' ? item.englishName : item.chineseName
            }
          }) ?? [])
        })

      }




    }
  });
  useEffect(() => {
    if (shop.select.id) {
      run();
    }

  }, [shop.select.id]);
  console.log(data, 'datadatadatadatadatadatadatadatadatadatadatadata');


  return {
    dynamicTypeList: data && [{ id: '1', name: t('dynamic.tabs.text1'), isAll: true }, ...data],
    storeId: shop.select.id,
  };
};
