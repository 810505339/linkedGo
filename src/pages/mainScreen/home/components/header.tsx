import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Appbar, Text } from 'react-native-paper';
import { Image, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { initList, store, findIndex } from '@store/shopStore';

import CustomModal, { IItemProp } from '@components/custom-modal';
import useSelectShop from '@hooks/useSelectShop';

import { load, save } from '@storage/shop/action';
import { useTranslation } from 'react-i18next';
const LOGO = require('@assets/imgs/home/logo.png');

const xialaIcon = require('@assets/imgs/base/xiala.png')

const Header = ({ layout, options, onChange }: BottomTabHeaderProps & { onChange: (value: any) => void }) => {
  const { snap, bottomSheetModalRef, shop, onPress, shopName } = useSelectShop(false);
  const { t } = useTranslation()

  //点击展开
  const handlePresentModalPress = async () => {
    bottomSheetModalRef.current?.present();
  };



  useEffect(() => {
    if (shop.select.id != '') {
      onChange(shop.select);
    }
  }, [shop.select?.id]);

  return (<Appbar.Header style={{ backgroundColor: 'transparent' }}>
    <Image source={LOGO} className="w-16 h-8 ml-5" />
    <Appbar.Content style={{
      alignItems: 'flex-end',
      justifyContent: "center",
    }} onPress={handlePresentModalPress} title={(<Text numberOfLines={2} className=" text-base  items-center justify-center  font-bold ">{shopName}</Text>)} tvParallaxTiltAngle={1} />
    <TouchableOpacity onPress={handlePresentModalPress}>
      <Image source={xialaIcon} className='w-4 h-4' />
    </TouchableOpacity>
    <CustomModal ref={bottomSheetModalRef} data={snap.shopList} selectValue={shop.select.id} onPress={onPress} headerText={t('common.label1')} snapPoints={['50%']} />
  </Appbar.Header >);
};

export default Header;
