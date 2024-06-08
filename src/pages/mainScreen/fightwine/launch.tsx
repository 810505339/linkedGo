//发起酒局

import BaseLayout from '@components/baselayout';
import { useRequest } from 'ahooks';
import { selectableMode } from '@api/fightwine';
import { ImageBackground, TouchableOpacity, View, Image, ImageSourcePropType } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@router/type';
import useMode from './hooks/useMode';
import { useTranslation } from 'react-i18next';
import CheckSex from '@components/baselayout/checkSex';
const bg1 = require('@assets/imgs/home/launch/bg1.png');
const bg2 = require('@assets/imgs/home/launch/bg2.png');
const bg3 = require('@assets/imgs/home/launch/bg3.png');
const bg4 = require('@assets/imgs/home/launch/bg4.png');
const btn = require('@assets/imgs/home/launch/btn.png');
const icon = require('@assets/imgs/home/preset/icon.png');

type Item = {

  bg: ImageSourcePropType;
  color: string;
  winePartyMode: string;
  modeName?: string
  modeIntro?: string
}

const Item = (props: Item & { onPress: (winePartyMode: string, modeName: string) => void }) => {
  const { modeName = '', modeIntro, bg, color, onPress, winePartyMode } = props;


  return (<TouchableOpacity onPress={() => onPress(winePartyMode, modeName)}>
    <View className="m-2.5 h-28 box-border  px-5 py-8 rounded-2xl overflow-hidden  flex-row justify-between items-center">
      <ImageBackground source={bg} className="h-28   absolute -z-10 left-0 right-0 bottom-0 top-0" />
      <View>
        <Text className=" font-bold text-2xl mb-1" style={{ color: color }}>{modeName}</Text>
        <Text className="opacity-50 text-sm font-normal">{modeIntro}</Text>
      </View>
      <View className="flex items-center justify-center ">
        <Image source={btn} className="relative z-20 w-8 h-8" />
      </View>
    </View>
  </TouchableOpacity>);
};
const Launch = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TouchableOpacity onPress={toRuleUrl}>
        <View className="border-[#EE2737] border py-1 px-2 rounded-3xl text-[#EE2737] flex-row items-center">
          <Image source={icon} className="w-6 h-6 mr-1" />
          <Text style={{ color: '#EE2737' }}>{t('common.label5')}</Text>
        </View>
      </TouchableOpacity>
    })
  }, [navigation])

  /* 规则弹窗 */
  const toRuleUrl = () => {
    navigation.navigate('PresetRule', {
      type: 'SHARE_WINE_RULE'
    });
  }

  //这里业务接口
  const list: Item[] = [
    { bg: bg1, color: '#79ABFFFF', winePartyMode: 'FEMALE_AA' },
    { bg: bg2, color: '#DF9E54FF', winePartyMode: 'AA' },
    { bg: bg3, color: '#63E2DDFF', winePartyMode: 'PAY_SOLO' },
    { bg: bg4, color: '#EE76ADFF', winePartyMode: 'MALE_AA' },
  ];



  const { modeList } = useMode<Item[]>('selectableMode', list);

  const itemClick = (winePartyMode: string, modeName: string) => {
    navigation.navigate('LaunchWine', {
      winePartyMode,
      modeName,
    });
  };






  return (<BaseLayout>

    {modeList.map(l => <Item key={l.winePartyMode} {...l} onPress={itemClick} />)}
    <CheckSex />
  </BaseLayout>);
};



export default Launch;
