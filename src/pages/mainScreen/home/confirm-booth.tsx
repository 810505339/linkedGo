//发起酒局

import BaseLayout from '@components/baselayout';
import React, { ReactNode, useEffect } from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import { Button, Divider, Icon, Text, TextInput } from 'react-native-paper';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Panel from '@components/panel';
import BoothsList from './components/boothList';
import { RootStackParamList } from '@router/type';
import { fileStore } from '@storage/store/getfileurl';
import PackageList from './components/packageList';
import useSelectBooths from '@hooks/useSelectBooths';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useSelectShop from '@hooks/useSelectShop';
import { useImmer } from 'use-immer';
import { useTranslation } from 'react-i18next';
import { booking } from '@api/booths';
import Toast from 'react-native-toast-message';
import { useRequest } from 'ahooks';
import currency from 'currency.js';
import { findIndex } from '@storage/store/shopStore';
import NumberInput from '@components/number-input';



type IItem = {
  label: string,
  render: () => ReactNode,
}


const width = Dimensions.get('window').width;
const card_2 = require('@assets/imgs/base/card_2.png');
const ConfirmBooth = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ConfirmBooth'>>();
  const { t } = useTranslation();
  const { areaId, entranceDate, latestArrivalTime, areaName, storeId, img } = route.params;

  const { runAsync, loading } = useRequest(booking, {
    manual: true
  })


  const { booths, itemPress } = useSelectBooths({ areaId, entranceDate });
  const { shopName } = useSelectShop();
  const [data, setData] = useImmer({
    selectPackage: {},
    num: 1,
    loading: false

  });
  const file = fileStore.fileUrl;
  const selectBooth: any = booths?.activeIndex != undefined ? booths.list[booths?.activeIndex] : {
    maxAccommodate: 0,
    reserveAmount: 0,
  }

  const changePackage = (list: any[], index: number | undefined) => {
    if (index != undefined) {
      setData((draft) => {
        draft.selectPackage = list[index];

      });
    }
  };
  const handleItemPress = (i: number) => {
    setData((draft) => {
      draft.selectPackage = booths.list[0]
      draft.num = 1
    })
    itemPress(i)
  }

  const list: IItem[] = [
    {
      /* 卡座列表 */
      label: t('confirmBooth.label1'), render: () => {
        return (<View>
          <BoothsList itemPress={handleItemPress} {...booths} />
        </View>)

      },
    },
    /* 到店人数 */
    {
      label: undefined, render: () => (<View className="flex-row items-center  justify-between">
        <Text className="text-xs font-bold mb-2.5 opacity-50">{t('reserveBooth.label2')}</Text>
        <NumberInput min={1} num={data.num} max={selectBooth?.maxAccommodate} onChange={changeSum} />
      </View>)
    },
    /* 套餐 */
    {
      label: t('confirmBooth.label2'), render: () => (<View >
        <PackageList boothId={selectBooth?.boothId} onChange={changePackage} changeLoading={changeLoading} />
        <Text className="text-[#E6A055FF] mt-5  text-[10px]" >*  {t('confirmBooth.label8')}</Text>
      </View>),
    }
  ];


  const toUrl = () => {

    const feeRate = findIndex(storeId)?.feeRate ?? 0
    const taxRate = findIndex(storeId)?.taxRate ?? 0



    if (!selectBooth.boothId) {
      Toast.show({
        text1: t('orders.tip'),
      });
      return;
    }

    /* 预定总金额 */
    const reservedAmount = `S$${selectBooth?.reserveAmount}`


    navigation.navigate('OrdersInfo', {
      orderContext: [
        { label: t('orders.label1'), value: shopName },
        { label: t('orders.label2'), value: `${areaName} - ${selectBooth?.name}` },
        { label: t('orders.label3'), value: data.selectPackage?.name },
        { label: t('orders.label4'), value: entranceDate + ' ' + latestArrivalTime },
        { label: t('orders.label5'), value: data.num },



      ],
      headerImg: card_2,
      submit: async (params) => {
        const res = await runAsync({
          storeId: storeId,
          areaId: areaId,
          entranceDate: entranceDate,
          boothId: selectBooth?.boothId,
          latestArrivalTime: latestArrivalTime,
          productName: data.selectPackage?.name,
          peopleNum: data.num,
          ...params
        });
        return {
          orderId: res?.data?.orderId
        }

      },
      useScope: 'BOOTH', //使用范围
      boothId: selectBooth?.boothId,
      storeId: storeId,
      amount: selectBooth?.reserveAmount,
      taxAmount: currency(selectBooth?.reserveAmount).multiply(taxRate).divide(100),
      feeAmount: currency(selectBooth?.reserveAmount).multiply(feeRate).divide(100),

    });
  };

  const changeSum = (sum: number) => {
    setData(draft => {
      draft.num = sum;
    });
  };

  const changeLoading = (loading: boolean) => {
    setData(draft => {
      draft.loading = loading
    })
  }

  console.log(img, 'img');


  return (<BaseLayout loading={loading || data.loading}>
    {<Image resizeMode="cover" className="absolute top-0" style={{ width: width, height: 500 }} source={{ uri: file + '/' + img }} />}
    <ScrollView>
      <Panel className="mt-[200]">
        {list.map((item, i) => (
          <View className="mb-[30px]" key={i}>
            {item?.label && <Text className="text-xs font-bold mb-2.5 opacity-50">{item?.label}</Text>}

            {item.render()}
          </View>
        ))}

      </Panel>
    </ScrollView>
    <View className="h-14  flex-col justify-center">
      <Divider />
      <View className="flex-row items-center justify-between  px-5 mt-2">
        <View>
          <Text style={{ fontSize: 10 }}>{t('confirmBooth.label5')} <Text className="text-[#E6A055FF]">{selectBooth?.maxAccommodate}</Text>{t('confirmBooth.label6')}</Text>
          <Text className="mt-2" style={{ fontSize: 10 }}>{t('confirmBooth.label7')}： <Text className="text-[#E6A055FF]">S$ {selectBooth?.reserveAmount}</Text></Text>
        </View>
        <Button mode={'elevated'} className="bg-[#EE2737FF]" textColor="#0C0C0CFF" onPress={toUrl} >
          {t('common.btn2')}
        </Button>
      </View>
    </View>

  </BaseLayout>);
};



export default ConfirmBooth;
