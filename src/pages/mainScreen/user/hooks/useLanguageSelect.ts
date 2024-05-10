import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { IItemProp } from '@components/custom-modal';
import { useMemo, useRef, useState } from 'react';
import { loadLanguageStorage, saveLanguageStorage } from '@storage/language/action';
import { changeLanguage } from '@utils/i18next';
export default () => {
  const languageList = useMemo(() => {
    return [
      { id: '0', name: 'English', key: 'en' },
      { id: '1', name: '简体中文', key: 'zh' },
    ];
  }, []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectValue, setSelectValue] = useState(languageList[0].id);
  /* 弹窗 */
  async function showLanguage() {
    console.log(bottomSheetModalRef.current);
    bottomSheetModalRef.current?.present();
    const { language } = await loadLanguageStorage();
    /* 找到当前选择的语言 */
    const findId = languageList.find(l => l.key === language)?.id ?? languageList[0].id;
    setSelectValue(findId);

  }
  /* 点击确认按钮 */
  async function selectLanguage(item: IItemProp) {
    await saveLanguageStorage(item.key);
    setSelectValue(item.id);
    bottomSheetModalRef.current?.dismiss();
    await changeLanguage();
  }

  //


  return {
    bottomSheetModalRef,
    showLanguage,
    languageList,
    selectLanguage,
    selectValue,
  };
};
