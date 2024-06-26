import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import BaseLayout from '@components/baselayout';
import { View, Animated, RefreshControl, Image, ImageSourcePropType, ImageBackground, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Share } from 'react-native';
import { Button, Divider, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useState } from 'react';
import RenderHtml from 'react-native-render-html';
import { useImmer } from 'use-immer';
import { useAsyncEffect, useRequest } from 'ahooks';
import { getDynamicInfo, isAlreadySignUp, signUp } from '@api/dynamic';
import { RootStackParamList, ScreenNavigationProp } from '@router/type';
import { useTranslation } from 'react-i18next';
import { fileStore } from '@store/getfileurl';
import { loadLanguageStorage } from "@storage/language/action";
import { getGenericPassword, UserCredentials } from 'react-native-keychain';
import useSelectShop from '@hooks/useSelectShop';
import { findIndex } from '@store/shopStore';
import currency from 'currency.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyModal from '@components/modal';
import Toast from 'react-native-toast-message';

const hot = require('@assets/imgs/base/hot.png');
const cardHeader = require('@assets/imgs/base/cardHeader.png');
const modalHeader = require('@assets/imgs/modal/header.png');
const modalBg = require('@assets/imgs/modal/bg.png');

const DynamicInfo = () => {

  const [l, setL] = useState('en')
  useEffect(() => {
    (async () => {
      const { language } = await loadLanguageStorage()
      setL(language)
      console.log(language, 'language');

    })()

  }, [])
  const { shop } = useSelectShop()
  const route = useRoute<RouteProp<RootStackParamList, 'DynamicInfo'>>();
  const navigation = useNavigation<ScreenNavigationProp<'DynamicInfo'>>();
  const { t } = useTranslation();
  // const { id, tagList, title, content, publishDate, pageView, source: img } = route.params;
  const { id } = route.params;


  const { width } = useWindowDimensions();

  const [info, setInfo] = useImmer({
    visible: false,
  });

  const onScroll = (nativeEvent: NativeSyntheticEvent<NativeScrollEvent>) => {
    // 获取当前滚动的位置
    const scrollPosition = nativeEvent.nativeEvent.contentOffset.y;
    navigation.setOptions({
      headerStyle: {
        backgroundColor: scrollPosition >= 64 ? '#0B0B0BFF' : 'transparent',
      },
    });
  };
  const { data: application, runAsync: applicationRun } = useRequest(() => isAlreadySignUp(id), {
    manual: true
  });
  const { data: res, loading, runAsync: infoRun } = useRequest(() => getDynamicInfo({ id: id }), {
    onSuccess: (res) => {
      console.log(res, 'res')
      if (!res.success) {
        navigation.goBack()
      }
    }
  });
  const data = res?.data



  const { runAsync } = useRequest(signUp, {
    manual: true,
  });

  useEffect(() => {
    (async () => {
      const generic = await getGenericPassword()

      console.log(generic, 'generic', (generic as UserCredentials)?.password != '')

      if ((generic as UserCredentials)?.password != '') {
        console.log('请求了')
        await applicationRun()
      }
    })()

  }, [])

  const RenderList = ({ item }) => {

    const { activityTime, activityPlace, amount, useOfExpenses, activityPersonNumber, activitySignUpNumber, showOrNotPersonNumber, areaName, storeName } = item;


    const list = [
      { label: t('dynamic.info.tag1'), value: activityTime },
      { label: t('dynamic.info.tag6'), value: storeName + ' - ' + areaName },
      { label: t('dynamic.info.tag2'), value: activityPlace },
      {
        label: t('dynamic.info.tag3'), value: amount, render: () => {
          return (<Text className="text-[#E6A055FF] ml-2" numberOfLines={2}>S${amount}</Text>);
        },
      },
      { label: t('dynamic.info.tag4'), value: useOfExpenses },
      {
        label: t('dynamic.info.tag5'), value: showOrNotPersonNumber == '1', render: () => {
          return (<Text className="text-white font-bold ml-2">
            <Text className="text-[#E6A055FF]" numberOfLines={2}>{activitySignUpNumber}</Text> / {activityPersonNumber}
          </Text>);
        },
      },
    ];
    return (<View className="bg-[#FFFFFF0D] p-2.5 rounded-xl mt-4">
      {list.map((item, i) => (item.value && <View key={i} className="flex-row items-center my-1">
        <Text className="text-white opacity-50">{item.label}:</Text>
        {item?.render?.() ?? <Text className="text-white font-bold ml-2 " numberOfLines={2} style={{ flex: 1 }}>{item.value}</Text>}

      </View>))}
    </View>);
  };




  const onShare = async () => {
    console.log(1);

    try {
      const result = await Share.share({
        url: `https://m.point2club.com#/active/${id}`,
        message: '邀请您查看信息',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {

    }
  };

  const hideModal = () => {
    setInfo(darft => {
      darft.visible = false;
    });
  };

  const submit = () => {
    setInfo(darft => {
      darft.visible = true;
    });
  };
  const source = {
    html: l == 'en' ? data?.dynamicContentUk : data?.dynamicContentCn,
  };
  const img = fileStore?.fileUrl + '/' + data?.pictureFile[0]?.fileName
  const imgsource = data?.pictureFile[0]?.fileName ? { uri: img } : cardHeader
  const title = l == 'en' ? data?.dynamicTitleUk : data?.dynamicTitleCn
  const publishDate = data?.publishDate
  const pageView = data?.pageView
  const type = data?.type
  const whetherSignUp = data?.whetherSignUp == '1'
  const isFull = data?.activitySignUpNumber === data?.activityPersonNumber;
  const isApplication = application?.data;/* 判断是否已经报名 */
  const amount = data?.amount
  const amountText = !amount ? t('dynamic.tagList.tag2') : t('dynamic.tagList.tag3');
  const signText = whetherSignUp ? t('dynamic.tagList.tag1') : '';
  console.log(application, 'isApplication');

  /* 报名 */
  async function handleSignUp() {
    hideModal()

    console.log(amount, 'amount')

    if (amount) {
      const feeRate = findIndex(shop.select.id)?.feeRate ?? 0
      const taxRate = findIndex(shop.select.id)?.taxRate ?? 0
      const feeAmount = currency(amount).multiply(feeRate).divide(100)
      navigation.navigate('OrdersInfo', {
        orderContext: [
          /* 门店 */
          { label: t('orderInfo.tag1'), value: findIndex(shop.select.id)!.name ?? '' },
          /* 名称 */
          { label: t('orderInfo.tag28'), value: title },
          { label: t('dynamic.info.tag1'), value: data.activityTime },
          { label: t('dynamic.info.tag2'), value: data.activityPlace },
          { label: t('dynamic.info.tag4'), value: data.useOfExpenses },

        ],
        headerImg: imgsource,
        submit: async (params) => {
          const res = await runAsync({
            activityId: id,
            ...params
          });
          console.log(res, '这是提交的信息');

          return {
            orderId: res?.data?.orderId
          };
        },
        useScope: 'ACTIVITY', //使用范围
        storeId: shop.select.id,
        amount: amount,
        feeAmount: currency(amount).multiply(feeRate).divide(100),
        taxAmount: currency(amount + feeAmount.value).multiply(taxRate).divide(100),

      });
      return
    }

    const res = await signUp({
      payMethod: 'PAYNOW',
      useBalance: false,
      activityId: id,
    })

    console.log(res, '这是提交的信息');
    if (res.success) {
      Toast.show({
        text1: '报名成功'
      })
      await infoRun()
    }

  }



  const RenderBtn = () => {
    console.log(whetherSignUp, isFull, 'whetherSignUp')

    if (isApplication) {
      return <Button className=" bg-[#EE2737FF] flex-auto mr-2" mode="elevated" textColor="#0C0C0CFF" disabled={true} > {t('dynamic.info.btn3')}</Button>;
    }

    if (data?.activityPersonNumber != null && isFull && whetherSignUp) {
      return <Button className=" bg-[#EE2737FF] flex-auto mr-2" mode="elevated" textColor="#0C0C0CFF" disabled={true} > {t('dynamic.info.btn2')}</Button>;
    }

    return <Button className=" bg-[#EE2737FF] flex-auto mr-2" mode="elevated" textColor="#0C0C0CFF" onPress={submit}> {t('dynamic.info.btn1')}</Button>;
  };



  return (<BaseLayout showAppBar={false} source={false} loading={loading}>

    <ScrollView onScroll={onScroll}>
      <View className=" w-full h-[375]  relative">
        <ImageBackground source={imgsource} className="absolute inset-0 top-0 left-0 right-0 bottom-0 -z-10" />
        <View className="absolute bottom-0 left-0 right-0  text-center px-5 py-2 overflow-hidden">
          <BlurView
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}
            blurType="dark"
            blurAmount={1}
            reducedTransparencyFallbackColor="transparent"

          />
          <Text className="text-2xl font-bold" numberOfLines={3}>{title}</Text>
        </View>
      </View>
      <View className="px-5">
        <View className="flex-row mt-2.5">
          <View className={`px-2.5 py-1  rounded-2xl mr-2 bg-[#E6A05580]`}>
            <Text className="text-sm font-normal">{type}</Text>
          </View>
          {amount && <View className={`px-2.5 py-1  rounded-2xl mr-2`}>
            <Text className="text-sm font-normal">{amountText}</Text>
          </View>}


          <View className={`px-2.5 py-1  rounded-2xl mr-2`}>
            <Text className="text-sm font-normal">{signText}</Text>
          </View>

        </View>
        <View className="h-12 flex-row items-center justify-between mt-2.5 text-[#ffffff7f] text-xs">
          <Text className="text-[#ffffff7f] text-xs">{publishDate}</Text>
          <View className="flex-row">
            <Image source={hot} />
            <Text className=" text-[#ffffff7f] text-xs">{pageView}</Text>
          </View>
        </View>
        <Divider />

        {whetherSignUp && <RenderList item={data} />}

      </View>


      <View className="p-5">
        <RenderHtml
          baseStyle={{ fontSize: 14, color: '#ffffffbf' }}
          contentWidth={width - 40}
          source={source}
        />
      </View>
    </ScrollView>

    {
      whetherSignUp && <SafeAreaView>
        <View className="h-14 px-5">
          <Divider />
          <View className="flex-row items-center">
            <RenderBtn />
            <IconButton icon="upload" size={22} mode="contained" containerColor={'#EE2737FF'} iconColor={'#1A1311FF'} onPress={onShare} />
          </View>
        </View>
      </SafeAreaView>
    }

    {
      !whetherSignUp && <SafeAreaView>
        <View className="absolute right-0 bottom-1/3 z-50">
          <IconButton icon="upload" size={22} mode="contained" containerColor={'#EE2737FF'} iconColor={'#1A1311FF'} onPress={onShare} />
        </View>
      </SafeAreaView>
    }


    <Portal>
      <MyModal visible={info.visible} onDismiss={hideModal}>
        <View className="w-[285] h-72 bg-[#1E1E1EFF] items-center ml-auto mr-auto  rounded-2xl ">
          <ImageBackground source={modalBg} resizeMode="contain" className="absolute -left-1 -right-1 h-[160] top-0" />
          <Image source={modalHeader} resizeMode="contain" className="absolute w-[335] right-0 -top-20" />
          <View className="m-auto w-40">
            <Text className="text-base font-bold text-white  text-center mt-24" numberOfLines={2}>{t('dynamic.info.text1')}</Text>
          </View>
          <View className="flex-row justify-around items-center  w-full px-5 pb-5 mt-10 ">
            <Button className="bg-transparent  mr-5" mode="outlined" labelStyle={{ fontWeight: 'bold' }} textColor="#ffffffbf" onPress={hideModal}>{t('common.btn1')}</Button>
            <Button className="bg-[#EE2737FF] " textColor="#000000FF" labelStyle={{ fontWeight: 'bold' }} mode="contained" onPress={async () => await handleSignUp()} >{t('common.btn2')}</Button>
          </View>
        </View>
      </MyModal>
    </Portal>

  </BaseLayout>);
};



export default DynamicInfo;
