import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TabParamList, UsertackParamList } from '@router/type';
import Header from './components/header';
import { useCallback, useEffect, useState } from 'react';
import BaseLayout from '@components/baselayout';
import SwiperView from './components/swiperView';
import HorizontalFlatList from './components/HorizontalFlatList';
import { getcarouselList, getHomePageAdvertising } from '@api/common';
import { useImmer } from 'use-immer';
import { fileStore } from '@storage/store/getfileurl';
import { LogLevelEnum, TencentImSDKPlugin } from 'react-native-tim-js';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import useImageSize from '@hooks/useImageSize';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MyModal from '@components/modal';
import { useRequest } from 'ahooks';
import Toast from 'react-native-toast-message';
import useFindLanguage from '../user/hooks/useFindLanguage';
import useSelectShop from '@hooks/useSelectShop';
import useVersion from '@hooks/useVersion';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import Loading from '@components/baselayout/loading';
import { useNetInfo } from '@react-native-community/netinfo';
const headerIcon = require('@assets/imgs/base/modalHeader.png');
const closeIcon = require('@assets/imgs/base/close.png')

// const HOMEBG = require('@assets/imgs/home/bg.png')

type IData = {
  id: string;
  img: string
  img1: string
  swiperList: any[]
  visible: boolean
  advertising: any,
  advertising1: any
}

const init = async () => {
  const sdkAppID = 1600009072;
  await TencentImSDKPlugin.v2TIMManager.initSDK(
    sdkAppID,
    LogLevelEnum.V2TIM_LOG_DEBUG,
    undefined,
    true,
  );
};
let defaultlanguage = ''


const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<UsertackParamList>>();
  const { t } = useTranslation()
  const { isConnected } = useNetInfo();
  const { data: language, findlanguage } = useFindLanguage()
  const { allData, hideDialog, download, loading: versionloading } = useVersion();
  const { snap, bottomSheetModalRef, shop, onPress, shopName, init: shopInit, loading: shopLoading } = useSelectShop(false);

  const { imageSize, getSize } = useImageSize()
  const { imageSize: imageSize1, getSize: getSize1 } = useImageSize()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const [data, setData] = useImmer<IData>({
    id: '',
    swiperList: [],
    advertising: {},
    advertising1: {},
    img: '',
    img1: '',
    visible: false
  });

  const { runAsync, error, loading } = useRequest(() => {
    return Promise.all([getcarouselList({ storeId: data.id, limitNum: '5', type: '0' }), getHomePageAdvertising('0', data.id), getHomePageAdvertising('1', data.id)]);
  }, {
    manual: true
  });
  function onChange(value: any) {

    setData((draft: IData) => {
      draft.id = value.id;
    });
  }
  /* 轮播图跟广告 */
  async function getcarouselListApi() {
    console.log('跟新轮播图')
    const [res, advertising, advertising2] = await runAsync()
    const img = advertising?.data ? fileStore.fileUrl + '/' + advertising?.data?.pictureFile?.[0]?.fileName : ''
    const img1 = advertising2?.data ? fileStore.fileUrl + '/' + advertising2?.data?.pictureFile?.[0]?.fileName : ''

    getSize(img)
    getSize1(img1)

    setData((draft: IData) => {
      draft.swiperList = res ?? [];
      draft.img = img;
      draft.advertising = advertising?.data
      draft.advertising1 = advertising?.data
      draft.img1 = img1;
      draft.visible = img1 ? true : false;
    });

  }

  function advertisingClick(obj: any) {
    if (obj.jump && obj.dynamicStateId) {
      navigation.navigate('DynamicInfo', { id: obj.dynamicStateId });
    }
  }

  async function onRefresh() {
    setIsRefreshing(true)
    await shopInit()
    await getcarouselListApi()
    setIsRefreshing(false)
  }



  useEffect(() => {
    init();
  }, []);



  useEffect(() => {
    console.log(data.id, 'data.id');
    if (data.id) {
      getcarouselListApi();
    }
  }, [data.id]);

  useFocusEffect(() => {
    (async () => {
      await findlanguage()
      if (language) {
        const t = language.language
        console.log(language, 't')
        if (defaultlanguage !== t) {
          defaultlanguage = t
          if (data.id) {
            getcarouselListApi();
          }
        }
      }
    })()



  })




  useEffect(() => {
    navigation.setOptions({
      header: props => <Header {...props} onChange={onChange} />,
    });
  }, [navigation]);

  const containerStyle = { padding: 20 };

  if (versionloading || !isConnected) {

    return <BaseLayout>
      <Loading />
    </BaseLayout>
  }

  return (
    <BaseLayout className="bg-[#0B0B0BE6]" loading={loading && shopLoading} >

      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          < RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>

        {data.img && (<TouchableOpacity onPress={() => advertisingClick(data.advertising)}><Image source={{ uri: data.img }} className='h-[60] mx-5  mb-5 mt-2  rounded-2xl' /></TouchableOpacity>)}
        {<HorizontalFlatList className="mt-7" />}
        {data.swiperList && <SwiperView swiperList={data?.swiperList} />}
        {/* <View>

          <Image source={{ uri: 'https://club-h5.point2club.com/static/png/logo1-bbc02f49.png' }} className='w-40 h-40'></Image>
          {data.swiperList && data?.swiperList.map((item) => {
            return (
              <Text className='text-white'>{item.pictureFile}</Text>
            )
          })}
        </View> */}
      </ScrollView>


      <MyModal visible={data.visible} onDismiss={() => setData(draft => { draft.visible = false })} contentContainerStyle={containerStyle} dismissable={false}  >
        {data.img1 && (<TouchableOpacity onPress={() => advertisingClick(data.advertising1)}><Image source={{ uri: data.img1 }} style={{ height: imageSize1.h }} resizeMethod='auto' className='my-5 rounded-2xl' /></TouchableOpacity>)}
        <TouchableOpacity onPress={() => setData(draft => { draft.visible = false })} className='flex-row  items-center justify-center' >
          <Image source={closeIcon} className='w-6 h-6' />
        </TouchableOpacity>
      </MyModal>

      <MyModal
        visible={allData.isShow}
        onDismiss={hideDialog}
        dismissable={false}>
        <View className="w-[285]  bg-[#222222FF] items-center ml-auto mr-auto  rounded-2xl relative ">
          <Image
            source={headerIcon}
            resizeMode="contain"
            className="w-[285] h-[60] absolute -top-2 left-0 right-0"
          />
          <View>
            <Text className="text-lg font-bold text-white  text-center pt-2">
              {t('Modal.tip')}
            </Text>
          </View>
          <View className="m-auto py-8 px-5">
            <Text
              className="text-xs font-bold text-white  text-center "
              numberOfLines={2}>
              {allData.versionIntroduce}
            </Text>
          </View>
          <View className="flex-row justify-around items-center  w-full px-5 pb-5 ">
            <Button
              className="bg-transparent  mr-5 w-32"
              mode="outlined"
              labelStyle={{ fontWeight: 'bold' }}
              textColor="#ffffffbf"
              onPress={hideDialog}>
              {t('Modal.btn2')}
            </Button>
            <Button
              className="bg-[#EE2737FF] w-32 "
              textColor="#000000FF"
              labelStyle={{ fontWeight: 'bold' }}
              mode="contained"
              onPress={download}>
              {t('Modal.btn1')}
            </Button>
          </View>
        </View>
      </MyModal>
    </BaseLayout>
  );
};


export default HomeScreen;


