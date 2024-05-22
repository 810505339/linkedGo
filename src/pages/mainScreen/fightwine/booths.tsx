import BaseLayout from '@components/baselayout';
import BoothsList from '../home/components/boothList';
import { Dimensions, Image, ImageBackground, ScrollView, View } from 'react-native';
import { Button, Divider, Drawer, Modal, Portal, Switch, Text } from 'react-native-paper';
import NumberInput from '@components/number-input';
import useSelectBooths from '@hooks/useSelectBooths';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@router/type';
import Panel from '@components/panel';
import { fileStore } from '@store/getfileurl';
import { useTranslation } from 'react-i18next';
import PackageList from '../home/components/packageList';
import { useImmer } from 'use-immer';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { checkBooth, calPayAmount, create } from '@api/fightwine';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useSelectShop from '@hooks/useSelectShop';
import { useRequest } from 'ahooks';
import useUserInfo from '@hooks/useUserInfo';
import currency from 'currency.js';
import { findIndex } from '@store/shopStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyModal from '@components/modal';

const boy = require('@assets/imgs/fightwine/boys.png');
const girls = require('@assets/imgs/fightwine/girls.png');
const width = Dimensions.get('window').width;
const headerIcon = require('@assets/imgs/base/modalHeader.png');
const orderHeader = require('@assets/imgs/base/fightwineBg.png');
const Booths = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Booths'>>();
  const { areaId, entranceDate, partyName, latestArrivalTime, winePartyMode, storeId, areaName, modeName } = route.params;
  const { booths, itemPress } = useSelectBooths({ areaId, entranceDate, type: "getOpenBoothByWine" });
  const file = fileStore.fileUrl;
  const { t } = useTranslation();

  const { userInfoStorage } = useUserInfo()
  const gender = userInfoStorage?.userInfo?.gender





  const [data, setData] = useImmer({
    maleNum: 0,
    minmaleNum: 0,
    femaleNum: 0,
    minfemaleNum: 0,
    autoLock: true,
    visible: false,
    selectPackage: {},

  });
  const selectBooth: any = booths?.activeIndex != undefined ? booths.list[booths?.activeIndex] : {
    maxAccommodate: 0,
    reserveAmount: 0,
  }
  const { shopName } = useSelectShop();
  const { loading, runAsync } = useRequest((params) => calPayAmount(params), {
    debounceWait: 500,
    manual: true,
  });

  const { runAsync: checkBoothRunAsync, } = useRequest(checkBooth, {
    debounceWait: 500,
    manual: true,
  })



  useEffect(() => {
    // /* 获取性别 */
    // const gender = userInfoStorage.userinfo.gender


    setData(draft => {
      if (gender == '1') {
        draft.minmaleNum = 1
        draft.maleNum = 1
      }

      if (gender == '2') {
        draft.minfemaleNum = 1
        draft.femaleNum = 1
      }
    })

  }, [gender])

  const changePackage = (list: any[], index: number | undefined) => {
    if (index != undefined) {
      setData((draft) => {
        draft.selectPackage = list[index];
      });
    }
  };

  const onPresonChange = (num: number, key: string) => {
    setData(draft => {
      draft[key] = num;
    });
  };

  const onVerify = (num: number, needKey: string) => {
    if (!selectBooth?.maxAccommodate) {
      Toast.show({ text1: t('booths.tag1') });
      return true;
    }
    if (num + data[needKey] > selectBooth?.maxAccommodate) {
      return true;
    }

    return false;

  };

  const onSure = async () => {
    const res = await checkBoothRunAsync({
      entranceDate,
      boothId: selectBooth?.boothId,
    });
    setData(draft => {
      draft.visible = res.data.inParty;
    });
    if (!res.data.inParty) {
      onNext();
    }

  };
  const onNext = async () => {
    const feeRate = findIndex(storeId)?.feeRate ?? 0
    const taxRate = findIndex(storeId)?.taxRate ?? 0

    // await create({
    //   storeId: storeId,
    //   areaId: areaId,
    //   partyMode: winePartyMode,
    //   partyType: 'BOOK',
    //   partyName: partyName,
    //   entranceDate: entranceDate,
    //   latestArrivalTime: latestArrivalTime,
    //   boothId: selectBooth?.boothId,
    //   boothName: selectBooth?.name,
    //   drinksMealId: data.selectPackage?.id,
    //   ...data,
    // });

    setData((draft) => {
      draft.visible = false;
    })
    if ((!data.maleNum) && (!data.femaleNum)) {
      Toast.show({ text1: t('booths.tag2') });
      return;
    }

    const res = await runAsync({
      boothId: selectBooth?.boothId,
      partyMode: winePartyMode,
      maleNum: data.maleNum,
      femaleNum: data.femaleNum,
      entranceDate,
      playerType: 'PROMOTER',
    });


    if (!res.code) {
      navigation.navigate('OrdersInfo', {
        orderContext: [
          { label: t('orders.label1'), value: shopName },
          { label: t('orders.label2'), value: `${areaName} - ${selectBooth?.name}` },
          { label: t('orders.label3'), value: data.selectPackage?.name },
          { label: t('orders.label10'), value: partyName },
          { label: t('orders.label14'), value: modeName },
          { label: t('orders.label11'), value: entranceDate + ' ' + latestArrivalTime },
          { label: t('orders.label12'), value: data.maleNum },
          { label: t('orders.label13'), value: data.femaleNum },
          { label: t('orderInfo.tag29'), value: `S$${selectBooth?.reserveAmount}` },
          { label: t('orders.label7'), value: `S$${res.data.payAmount}` },
        ],
        headerImg: orderHeader,
        submit: async (params) => {

          const _data = { ...data }
          _data.selectPackage = {}

          const res = await create({
            storeId: storeId,
            areaId: areaId,
            partyMode: winePartyMode,
            partyType: 'BOOK',
            partyName: partyName,
            entranceDate: entranceDate,
            latestArrivalTime: latestArrivalTime,
            boothId: selectBooth?.boothId,
            boothName: selectBooth?.name,
            drinksMealId: data?.selectPackage?.isDefault ? '' : data.selectPackage?.id,
            ..._data,
            ...params
          });
          console.log(res, '这是提交的信息');
          return {
            orderId: res?.data?.orderId
          };
        },
        useScope: 'WINE_PARTY', //使用范围
        winePartyMode: winePartyMode,
        storeId: storeId,
        amount: `${res.data.payAmount}`,
        taxAmount: currency(res.data.payAmount).multiply(taxRate).divide(100),
        feeAmount: currency(res.data.payAmount).multiply(feeRate).divide(100),


      });
    }

  };

  const onDismiss = () => {
    setData(draft => {
      draft.visible = !draft.visible;
    });
  };

  const list = [

    { label: t('confirmBooth.label1'), render: () => <BoothsList itemPress={itemPress} {...booths} /> },
    {
      label: t('booths.tag2'), render: () => (<View>
        {selectBooth?.maxAccommodate ? <Text className="text-center mb-5 text-[10px]"> {t('booths.tag3')} <Text className="text-[#E6A055FF] font-bold">{selectBooth?.maxAccommodate}</Text>  {t('booths.tag4')}</Text> : null}

        <View className=" flex flex-row justify-between items-center">
          <View className="flex-col  items-center">
            <View className=" w-[100px]  h-[100px] mb-2.5">
              <Image source={girls} className="flex-auto" />
              <View className=" absolute z-10 left-0 right-0 top-0 bottom-0 justify-center items-center">
                <Text className="text-2xl  font-bold m-auto">{t('booths.tag6')}</Text>
              </View>
            </View>
            <NumberInput num={data.femaleNum} min={data.minfemaleNum} onChange={(num) => onPresonChange(num, 'femaleNum')} onVerify={(num) => onVerify(num, 'maleNum')} />
          </View>
          <View className="flex-col  items-center">
            <View className=" w-[100px]  h-[100px] mb-2.5">
              <Image source={boy} className="flex-auto" />
              <View className="absolute z-10 left-0 right-0 top-0 bottom-0 justify-center items-center">
                <Text className="text-2xl font-bold  m-auto">{t('booths.tag5')}</Text>
              </View>
            </View>
            <NumberInput num={data.maleNum} min={data.minmaleNum} onChange={(num) => onPresonChange(num, 'maleNum')} onVerify={(num) => onVerify(num, 'femaleNum')} />
          </View>
        </View>
      </View>),
    },
    {
      label: t('confirmBooth.label2'), render: () => (<View>
        <PackageList boothId={selectBooth?.boothId} onChange={changePackage} />
        <Text className="text-[#E6A055FF] mt-5" style={{ fontSize: 10 }}>*  {t('confirmBooth.label8')}</Text>
      </View>),
    },
    {
      label: t('booths.tag11'), render: () => {
        return (<View className="flex-col">
          <Divider />
          <View className="flex-row items-center justify-between py-4">
            <Text numberOfLines={2}>{t('booths.tag7')}</Text>
            <Switch value={data.autoLock} onValueChange={() => setData(draft => { draft.autoLock = !draft.autoLock; })} />
          </View>
          <Divider />
          <Text className="text-[#E6A055FF] mt-2" style={{ fontSize: 10 }}>{t('booths.tag8')}</Text>
        </View>);
      },
    },

  ];


  useEffect(() => {
    //清空数据
  }, [booths?.activeIndex]);





  return (<BaseLayout loading={loading}>
    {<Image resizeMode="cover" className="absolute top-0" style={{ width: width, height: 500 }} source={{ uri: file + '/' + booths?.picture?.fileName }} />}
    <ScrollView >
      <Panel className="mt-[200]">
        {list.map((item, i) => (
          <View className="mb-8" key={i}>
            <Text className="text-xs font-bold mb-2.5 opacity-50">{item.label}</Text>
            {item.render()}
          </View>
        ))}
      </Panel>
    </ScrollView>
    <SafeAreaView>
      <View className="h-14  flex-col justify-center">
        <Divider />
        <View className="flex-row items-center justify-between  px-5 mt-2">
          <View>
            <Text style={{ fontSize: 10 }}>{t('confirmBooth.label5')} <Text className="text-[#E6A055FF]">{selectBooth?.maxAccommodate}</Text>{t('confirmBooth.label6')}</Text>
            <Text className="mt-2" style={{ fontSize: 10 }}>{t('confirmBooth.label7')}： <Text className="text-[#E6A055FF]">S$ {selectBooth?.reserveAmount}</Text></Text>
          </View>
          <Button mode={'elevated'} className="bg-[#EE2737FF]" textColor="#0C0C0CFF" onPress={onSure} >{t('common.btn2')}</Button>
        </View>
      </View>
    </SafeAreaView>

    <Portal>
      <MyModal visible={data.visible} onDismiss={onDismiss}>
        <View className="w-[285]  bg-[#222222FF] items-center ml-auto mr-auto  rounded-2xl relative ">
          <Image source={headerIcon} resizeMode="contain" className="w-[285] h-[60] absolute -top-2 left-0 right-0" />
          <View>
            <Text className="text-lg font-bold text-white  text-center pt-2">{t('booths.tag9')}</Text>
          </View>
          <View className="m-auto py-8 px-5">
            <Text className="text-xs font-bold text-white  text-center " numberOfLines={2}>{t('booths.tag10')}</Text>
          </View>
          <View className="flex-row justify-around items-center  w-full px-5 pb-5 ">
            <Button className="bg-transparent mr-5" mode="outlined" labelStyle={{ fontWeight: 'bold' }} textColor="#ffffffbf" onPress={onDismiss} >{t('common.btn5')}</Button>
            <Button className="bg-[#EE2737FF] " textColor="#000000FF" labelStyle={{ fontWeight: 'bold' }} mode="contained" onPress={onNext} >{t('common.btn4')}</Button>
          </View>
        </View>
      </MyModal>
    </Portal>

  </BaseLayout>);
};

export default Booths;
