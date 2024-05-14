import { useNavigation } from '@react-navigation/native';
import { TabParamList, UsertackParamList } from '@router/type';
import Header from './components/header';
import { useEffect, useState } from 'react';
import BaseLayout from '@components/baselayout';
import SwiperView from './components/swiperView';
import HorizontalFlatList from './components/HorizontalFlatList';
import { getcarouselList, getHomePageAdvertising } from '@api/common';
import { useImmer } from 'use-immer';
import { fileStore } from '@store/getfileurl';
import { LogLevelEnum, TencentImSDKPlugin } from 'react-native-tim-js';
import { Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import useImageSize from '@hooks/useImageSize';
import { Modal } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MyModal from '@components/modal';


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




const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<UsertackParamList>>();

  const { imageSize, getSize } = useImageSize()
  const { imageSize: imageSize1, getSize: getSize1 } = useImageSize()

  const [data, setData] = useImmer<IData>({
    id: '',
    swiperList: [],
    advertising: {},
    advertising1: {},
    img: '',
    img1: '',
    visible: false
  });
  function onChange(value: any) {
    console.log(value, 'value');

    setData((draft: IData) => {
      draft.id = value.id;
    });
  }
  /* 轮播图跟广告 */
  async function getcarouselListApi() {
    const [res, advertising, advertising2] = await Promise.all([getcarouselList({ storeId: data.id, limitNum: '5', type: '0' }), getHomePageAdvertising('0', data.id), getHomePageAdvertising('1', data.id)])
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
    if (obj.jump) {
      navigation.navigate('DynamicInfo', { id: obj.dynamicStateId });
    }
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


  useEffect(() => {
    navigation.setOptions({
      header: props => <Header {...props} onChange={onChange} />,
    });
  }, [navigation]);

  const containerStyle = { padding: 20 };
  return (
    <BaseLayout className="bg-[#0B0B0BE6]" loading={false}>
      {data.img && (<TouchableOpacity onPress={() => advertisingClick(data.advertising)}><Image source={{ uri: data.img }} className='h-[60] mx-5 my-5  rounded-2xl' /></TouchableOpacity>)}
      {<HorizontalFlatList className="mt-7" />}
      {data.swiperList && <SwiperView swiperList={data?.swiperList} />}

      <MyModal visible={data.visible} onDismiss={() => setData(draft => { draft.visible = false })} contentContainerStyle={containerStyle} dismissable={false}  >
        {data.img1 && (<TouchableOpacity onPress={() => advertisingClick(data.advertising1)}><Image source={{ uri: data.img1 }} resizeMethod='auto' className='h-[440px]  mx-[44px] my-5 rounded-2xl' /></TouchableOpacity>)}
        <TouchableOpacity onPress={() => setData(draft => { draft.visible = false })} className='flex-row  items-center justify-center' >
          <Image source={closeIcon} className='w-6 h-6' />
        </TouchableOpacity>
      </MyModal>
    </BaseLayout>
  );
};


export default HomeScreen;


