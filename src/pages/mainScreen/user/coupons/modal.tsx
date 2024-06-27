import BaseLayout from '@components/baselayout';
import { getCustomerCoupon } from '@api/coupon';
import { ImageBackground, TouchableOpacity, View, useWindowDimensions, Animated, Image } from 'react-native';
import { Button, RadioButton, Text } from 'react-native-paper';

import CustomFlatList from '@components/custom-flatlist';

import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@router/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const headerImg = require('@assets/imgs/base/coupons-header.png');
const icon = require('@assets/imgs/user/info.png')
const usedIcon = require('@assets/imgs/user/used.png')
const expiredIcon = require('@assets/imgs/user/expired.png')
const bgColor = {
  DISCOUNT_VOUCHERS: 'bg-[#DB671EFF]',
  CASH_VOUCHERS: 'bg-[#EE2737FF]', //EE2737FF
  MAX_OUT_VOUCHERS: 'bg-[#E6A055FF]',
};


type IFirstRouteProps = {
  available: boolean
  params: any
}

const FirstRoute = (props: IFirstRouteProps) => {
  const { available, params } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = useState('');
  const [list, setList] = useState([]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onChecked = (id: string) => {

    setChecked(id === checked ? '' : id);
    /* 回到上一个页面   couponId优惠卷Id */
    // navigation.navigate({
    //   name: 'OrdersInfo',
    //   params: { couponId: id },
    //   merge: true,
    // });
  };


  const handleClick = () => {
    /* 回到上一个页面   couponId优惠卷Id */
    navigation.navigate({
      name: 'OrdersInfo',
      params: { couponId: checked },
      merge: true,
    });
  }

  const getList = (list: any) => {
    setList(list)
  }



  const isShow = list.length > 0
  return <View className="mt-10 relative flex-1 " >
    <CustomFlatList getList={getList}
      renderItem={(item, index) => <Item item={item} index={index} t={t} checked={checked} onChecked={onChecked} available={available} />}
      onFetchData={getCustomerCoupon} keyExtractor={(item) => item.id}
      params={{ available: available, ...params }}
    />
    {available && isShow && <View className="absolute left-5 right-5 bottom-0  h-32">
      <Button
        mode="outlined"
        style={{
          borderColor: '#EE2737FF',
          height: 50,
          borderRadius: 33,
          backgroundColor: '#EE2737FF'
        }}
        labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
        contentStyle={{ height: 50 }} onPress={handleClick} >
        {t('common.btn2')}
      </Button>
    </View>}



  </View>;
};







export const Item = (props: any) => {
  const { item, index, t, checked, onChecked, available, showCheck = true, } = props
  const [show, setShow] = useState(false)
  const StateIcon = item.useState === "EXPIRED" ? usedIcon : expiredIcon
  const changeShow = () => {
    setShow(!show)
  }

  const useExplain = item.couponVO.useExplain
  const { name, couponTypeDetailVO } = item.couponVO;
  const imageBg = available ? bgColor[couponTypeDetailVO?.type] : 'bg-[#666666FF]';
  const renderText = () => {
    const unitE = couponTypeDetailVO.type === 'DISCOUNT_VOUCHERS' ? t('coupons.text5') : '';
    const unitS = couponTypeDetailVO.type !== 'DISCOUNT_VOUCHERS' ? 'S$' : '';
    return couponTypeDetailVO.discount && <Text className="font-bold text-white text-2xl">{unitS} {couponTypeDetailVO.discount} {unitE}</Text>;
  };

  return <View className='my-2.5'>
    <TouchableOpacity className="mx-5 flex-row rounded-xl overflow-hidden h-24 relative " onPress={() => onChecked?.(item.id)}>

      <View className={`${imageBg} w-32 justify-center items-center`}>
        {renderText()}
        {couponTypeDetailVO?.doorSill && <Text>{t('coupons.text3')}S${couponTypeDetailVO?.doorSill}{t('coupons.text4')}</Text>}
      </View>
      <View className=" flex-auto bg-[#151313FF] p-2.5 flex-row ">
        {!available && <ImageBackground source={StateIcon} className='w-[84px] h-[93px] absolute top-0  right-0 -z-10' />}
        <View>
          <Text className="text-xs font-bold">{name}</Text>
          <View className="flex-row  flex-auto mt-2">
            <Text style={{ fontSize: 10 }} className="bg-[#EE273733] rounded-2xl px-2 mr-2 h-5 leading-5">{t(`coupons.${couponTypeDetailVO?.type}`)}</Text>
          </View>
          <View className='flex flex-row  items-center  w-full '>
            <Text style={{ fontSize: 10 }} className="font-light text-[#ffffff7f]">有效期至{item.disabledTime}</Text>
            <TouchableOpacity onPress={changeShow} className=' relative z-20'>
              <Image source={icon} className='w-4 h-4 ml-6' />
            </TouchableOpacity>
          </View>

        </View>
        {showCheck && <View className="items-center ">
          {available && <RadioButton.Android status={checked === item.id ? 'checked' : 'unchecked'} onPress={() => onChecked(item.id)} value={item.id} />}
        </View>}
      </View>
    </TouchableOpacity>
    {show && <View className='mx-5 p-2.5 bg-[#2b2929] rounded-b-2xl'>
      <Text className='text-[rgba(255,255,255,.5)] text-[10px]'>
        {useExplain}
      </Text>
    </View>}


  </View>;
};


const CouponsModal = () => {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const route = useRoute<RouteProp<RootStackParamList, 'Carouseldemo'>>();

  console.log(route.params, 'route')

  // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: t('coupons.text1') },
    { key: 'second', title: t('coupons.text6') },
  ]);
  const _renderTabBar = (props: SceneRendererProps & {
    navigationState: NavigationState<{
      key: string;
      title: string;
    }>
  }) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);



    return (
      <View className="flex-row items-center justify-around h-20 ">

        {props.navigationState.routes.map((route, i) => {

          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          return (
            <TouchableOpacity
              className="flex-1"
              key={i}
              onPress={() => setIndex(i)}>
              <Animated.Text className={'text-center font-bold text-sm text-white'} style={{ opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };






  const renderScene = SceneMap({
    first: () => <FirstRoute available={true} params={route.params} />,
    second: () => <FirstRoute available={false} params={route.params} />,
  });


  return (<BaseLayout source={false}>
    <ImageBackground source={headerImg} resizeMode="stretch" className="absolute  top-0 left-0 right-0 h-[181px]" />
    <TabView
      lazy
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={_renderTabBar}
      initialLayout={{ width: layout.width }}
    />
  </BaseLayout>);
};

export default CouponsModal;
