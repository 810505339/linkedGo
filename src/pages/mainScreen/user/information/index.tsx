/*
 * @Author: 810505339
 * @Date: 2024-06-30 11:59:51
 * @LastEditors: 810505339
 * @LastEditTime: 2024-12-31 11:29:36
 * @FilePath: \linkedGo\src\pages\mainScreen\user\information\index.tsx
 * 记得注释
 */
import BaseLayout from '@components/baselayout';
import CustomFlatlist from '@components/custom-flatlist';
import { useRequest } from 'ahooks';
import { getBalanceInfo, balanceDetailPage } from '@api/balance';
import { getTenantList } from '@api/store';
import { Image, ImageBackground, RefreshControl, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import useSelectShop from '@hooks/useSelectShop';
import CustomModal from '@components/custom-modal';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';

const cardBg = require('@assets/imgs/information/card_bg.png')
const navBg = require('@assets/imgs/information/nav_bg.png')

const xiala=require('@assets/imgs/xiala_w.png')

type IListHeaderProps = {
  totalBalance: string,
  lockBalance: string,
  availableBalance: string,
}
const ListHeader = (props: { headerInfo: IListHeaderProps }) => {
  const { headerInfo } = props;
  const { t } = useTranslation()


  return <View>
    <View className="m-5 rounded-2xl relative    ">
      <ImageBackground source={cardBg} className='w-full h-[220px] absolute inset-0 z-0' resizeMode='contain' />
      <View className="ml-10 mt-10">
        <Text className="text-[#0b0b0bbf] font-normal" style={{ fontSize: 10 }}>{t('balance.text1')}</Text>
        <View className='flex-row mt-2'>
          <Text className='text-[24px] text-[#0B0B0BFF] mr-2 font-bold '>S$</Text>
          <Text className="text-[#0B0B0BFF]  text-5xl font-bold ">{headerInfo.totalBalance}</Text>
        </View>
      </View>
      <View className=" relative" >
        <ImageBackground source={navBg} className='w-full h-[110px] absolute inset-0 z-0' resizeMode='contain' />
        <View className='mt-5'>
          <View className="flex-row items-center w-full justify-center">
            <Text className="text-[#0b0b0bbf]  text-center " style={{ fontSize: 14 }}>{t('balance.text2')}</Text>
            <Text className="ml-2 ">S${headerInfo.lockBalance}</Text>
          </View>
          <View className="flex-row items-center w-full  justify-center mt-2">
            <Text className="text-[#0b0b0bbf] " style={{ fontSize: 14 }}>{t('balance.text3')}</Text>
            <Text className="ml-2  ">S${headerInfo.availableBalance}</Text>
          </View>
        </View>
      </View>
    </View>
    <View>
      <Text className="mt-8 mx-5 mb-2.5">{t('balance.text4')}</Text>
    </View>
  </View>;
};

const TRADE_TYPE = {
  TICKET: 'orders.tag3',
  BOOTH: 'orders.tag4',
  WINE_PARTY: 'orders.tag2',
  CANCEL_WINE_PARTY: 'orders.tag6',
  REFUND: 'orders.tag7'
};


const renderItem = (item: any, t: any) => {

  const color = item.tradeAmount > 0 ? `text-[#10C48FFF]` : `text-[#EE2737]`
  return <View className="mx-5 px-2.5 py-5 bg-[#16161680]  my-2.5 flex-row items-center justify-between rounded-3xl border border-[rgba(32,32,32,0.75)]">
    <View>
      <Text className="text-white font-normal text-xs mb-1">{t(TRADE_TYPE[item.tradeType])}</Text>
      <Text className="text-[#ffffff7f] font-normal text-xs">{item.tradeTime}</Text>
    </View>
    <View>
      <Text className={`font-bold text-2xl ${color}`}>{(item.tradeAmount > 0 ? '+' : '') + item.tradeAmount}</Text>
    </View>
  </View>;
};

const Information = () => {
    const { snap, bottomSheetModalRef, shop, onPress, shopName } = useSelectShop(false);
    const { data,run } = useRequest(getBalanceInfo, {
      manual:false
    });
  
  const { t } = useTranslation()

  function openModal(){
    bottomSheetModalRef.current?.present();
  }

  useEffect(()=>{
    run(shop.select.id)
  },[shop.select.id])
  

  return (<BaseLayout className="bg-[#0B0B0BFF]">
    { <Animated.View>
      <View >
      <TouchableOpacity onPress={openModal}  >
      <View className='flex-row relative  px-6 items-center justify-between'>
        <Text numberOfLines={1} className=" text-base  items-center justify-center">{shopName}</Text>
        <Image source={xiala} className='w-4 h-4 ' />
      </View>
    </TouchableOpacity>
      </View>
      
    {data?.data&&  
    <View>
       <ListHeader headerInfo={data?.data} />
       <CustomFlatlist renderItem={(item) => renderItem(item, t)} params={{ customerId: data?.data.customerId }} onFetchData={balanceDetailPage} keyExtractor={(item) => item.serialNum} />
    </View>
     }
    
     
    
      <CustomModal ref={bottomSheetModalRef} data={snap.shopList} selectValue={shop.select.id} onPress={onPress} headerText={t('common.label1')} snapPoints={['50%']} />
    </Animated.View>}
  </BaseLayout>);

};

export default Information;

