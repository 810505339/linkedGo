//发起酒局
import BaseLayout from '@components/baselayout';
import React, { ReactNode, useEffect } from 'react';
import { Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { Button, Divider, Icon, Text, TextInput } from 'react-native-paper';
import { useImmer } from 'use-immer';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AreaList from '../home/components/areaList';
import dayjs from 'dayjs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@router/type';
import useSelectShop from '@hooks/useSelectShop';
import Toast from 'react-native-toast-message';
import MyDateTimePicker from '@components/DateTimePicker';
import { useTranslation } from 'react-i18next';
import CheckSex from '@components/baselayout/checkSex';
import { tempPartyOpenStatus } from '@api/fightwine'
import { useRequest } from 'ahooks';
import CustomModal from '@components/custom-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
const icon = require('@assets/imgs/home/preset/icon.png');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

type IItem = {
  label: string,
  render: () => ReactNode,
}



const LaunchWine = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();



  useEffect(() => {
    /* 规则弹窗 */
    const toRuleUrl = () => {
      navigation.navigate('PresetRule', {
        type: 'SHARE_WINE_RULE'
      });
    }
    navigation.setOptions({
      headerRight: () => <TouchableOpacity onPress={toRuleUrl}>
        <View className="border-[#EE2737] border py-1 px-2 rounded-3xl text-[#EE2737] flex-row items-center">
          <Image source={icon} className="w-6 h-6 mr-1" />
          <Text style={{ color: '#EE2737' }}>{t('common.label5')}</Text>
        </View>
      </TouchableOpacity>
    })
  }, [navigation])

  const { t } = useTranslation()

  const route = useRoute<RouteProp<RootStackParamList, 'LaunchWine'>>();
  const { winePartyMode, modeName } = route.params;

  const { snap, bottomSheetModalRef, shop, onPress, shopName, showShop } = useSelectShop();

  /* 是否开启临时 */
  const { data: eData, run } = useRequest(() => tempPartyOpenStatus({ storeId: shop.select.id, partyMode: winePartyMode }), {
    manual: true
  })
  useEffect(() => {
    if (shop.select.id) {
      run()
    }

  }, [shop.select.id])
  /* 加一天 */
  const date = dayjs(new Date()).add(1, 'day').toDate()
  console.log(eData?.data?.data?.canChooseToday, '能否选择当天');

  let minimumDate = eData?.data?.data?.canChooseToday ? new Date() : date






  const [data, setData] = useImmer({
    timershow: false,
    date: minimumDate,
    lastDate: new Date(),
    lastDateShow: false,
    areaId: '',
    partyName: '',
    areaName: '',
    selectArea: {

    },
  });


  const beginTime = data.selectArea?.businessDateVOS?.[0]?.beginTime
  const endTime = data.selectArea?.businessDateVOS?.[0]?.beginTime
  const defaultTime = dayjs(beginTime, 'HH:mm:ss').toDate()
  const defaultendTime = dayjs(endTime, 'HH:mm:ss').toDate()

  console.log(beginTime, 'beginTime');


  useEffect(() => {
    if (beginTime) {
      console.log(defaultTime, 'defaultTime');

      setData((draft) => {
        draft.lastDate = defaultTime
        draft.lastDateShow = false
      })
    }
  }, [beginTime])


  const dateFormat = dayjs(data.date).format('YYYY-MM-DD');
  const lastDateFormat = dayjs(data.lastDate).format('HH:mm');
  const list: IItem[] = [
    {
      label: t('common.label1'), render: () => (<TextInput mode="outlined" className="flex-auto bg-transparent mt-4  text-sx "
        style={{ height: 40 }}
        value={shopName}
        showSoftInputOnFocus={false}
        outlineStyle={{ borderRadius: 10 }}
        contentStyle={{
          height: 40,
          fontSize: 14
        }}
        right={<TextInput.Icon icon="chevron-down"
          onPress={showShop} />}
        onPressIn={showShop} />)
    },
    //placeholder={t('launchwine.tag6')}
    { label: t('launchwine.tag1'), render: () => (<TextInput mode='outlined' outlineStyle={{ borderRadius: 10 }} style={{ height: 40, borderRadius: 10, fontSize: 14 }} contentStyle={{ height: 42 }} value={data.partyName} onChangeText={(text) => setData(draft => { draft.partyName = text; })} />) },
    /* 选择日期 */
    {
      label: t('launchwine.tag2'), render: () => (<TextInput mode='outlined' outlineStyle={{ borderRadius: 10 }} value={dateFormat} className="bg-transparent"
        showSoftInputOnFocus={false}
        style={{ height: 42 }} contentStyle={{ height: 42 }}
        onPressIn={() => setData((draft) => { draft.timershow = true; })} />)
    },
    {
      label: t('launchwine.tag3'), render: () => (<View>
        <TextInput mode='outlined' value={lastDateFormat} className="bg-transparent" outlineStyle={{ borderRadius: 10 }} style={{ height: 42, borderRadius: 10 }} contentStyle={{ height: 42 }} showSoftInputOnFocus={false} onPressIn={() => setData((draft) => { draft.lastDateShow = true; })} />
        <View className=" bg-[#eea95a19] p-2.5 items-center flex-row rounded-md mt-2.5">
          <Icon
            source="alert-circle"
            color="#FAAD14FF"
            size={20}
          />
          <Text className="text-[#F8B568FF] ml-2 text-xs font-normal">{t('launchwine.tag4')}</Text>
        </View>
      </View>),
    },
    { label: t('launchwine.tag5'), render: () => (shop.select.id != '' && <AreaList storeId={shop.select.id} date={dateFormat} onChange={changeArea} />) },
  ];

  //选择日期
  const onDateChange = (selectDate?: Date) => {
    const currentDate = selectDate || data.date;
    setData(draft => {
      draft.date = currentDate;
      draft.timershow = false;
    });
  };

  const setShowTime = (timershow: boolean) => {
    setData(draft => {
      draft.timershow = timershow;
    });
  }
  //选择最晚时间
  const onTimerChange = (selectDate: Date) => {
    const currentDate = selectDate || data.lastDate;
    console.log(currentDate);

    if (selectDate < defaultTime || selectDate > defaultendTime) {
      Toast.show({
        text1: '该时间未营业'
      })

      setData((draft) => {
        draft.lastDate = defaultTime
        draft.lastDateShow = false
      })
      return
    }

    setData(draft => {
      draft.lastDate = currentDate;
      draft.lastDateShow = false;
    });
  };

  //changeArea

  const changeArea = async (list: any, index: number) => {
    console.log(list[index], 'list');

    setData(draft => {
      draft.areaId = list[index]?.id;
      draft.areaName = list[index]?.name;
      draft.selectArea = list[index];
    });
  };


  const handleNext = () => {

    if (data.partyName === '') {
      Toast.show({
        text1: t('launchwine.tag6')
      });
      return;
    }

    if (!shop.select.id) {
      Toast.show({
        text1: t('launchwine.tag8')
      });
      return;
    }




    navigation.navigate('Booths', {
      partyName: data.partyName,
      areaId: data.areaId,
      entranceDate: dateFormat, //入场日期
      latestArrivalTime: lastDateFormat,
      winePartyMode,
      storeId: shop.select.id,//	最晚到场时间
      areaName: data.areaName,//	最晚到场时间
      modeName,
    });
  };



  return (<BaseLayout>
    <CustomModal ref={bottomSheetModalRef} data={snap.shopList} selectValue={shop.select.id} onPress={onPress} headerText={t('common.label1')} snapPoints={['50%']} />
    <ScrollView className="px-5 ">
      {list.map((item, i) => (
        <View className="mb-8" key={i}>
          <Text className="text-xs font-bold mb-2.5">{item.label}</Text>
          {item.render()}
        </View>
      ))}
      {data.timershow && <MyDateTimePicker onChange={onDateChange} date={data.date} open={data.timershow} setOpen={(show: boolean) => { setData((draft) => { draft.timershow = show }) }} mode="date" />}
      {data.lastDateShow && <MyDateTimePicker onChange={onTimerChange} date={data.lastDate} open={data.lastDateShow} setOpen={(show: boolean) => { setData((draft) => { draft.lastDateShow = show }) }} mode="time" />}


    </ScrollView>

    <SafeAreaView>
      <View className=" flex-col justify-center">
        <Divider />
        <Button
          mode="outlined"
          style={{ borderColor: '#EE2737', height: 50, borderRadius: 33, backgroundColor: '#EE2737' }}
          labelStyle={{
            fontSize: 18,
            color: '#0C0C0CFF',
            fontWeight: '600',
          }}
          contentStyle={{ height: 50 }}
          onPress={handleNext}>
          {t('launchwine.tag7')}
        </Button>
      </View>
    </SafeAreaView>

    <CheckSex />
  </BaseLayout>);
};



export default LaunchWine;
