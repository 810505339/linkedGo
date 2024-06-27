import BaseLayout from '@components/baselayout';
import Panel from '@components/panel';
import CustomModal from '@components/custom-modal';
import { ImageBackground, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, Divider, Text, TextInput } from 'react-native-paper';
import AreaList from './components/areaList';
import useSelectShop from '@hooks/useSelectShop';
import { useImmer } from 'use-immer';
import useSelectTimer from '@hooks/useSelectTimer';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import NumberInput from '@components/number-input';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@router/type';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import MyDateTimePicker from '@components/DateTimePicker';
import Toast from 'react-native-toast-message';

var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const card_2 = require('@assets/imgs/base/card_2.png');
const icon = require('@assets/imgs/home/preset/icon.png');
const ReserveBooth = () => {
  const navgation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  useEffect(() => {
    navgation.setOptions({
      headerRight: () => <TouchableOpacity onPress={toRuleUrl}>
        <View className="border-[#EE2737] border py-1 px-2 rounded-3xl text-[#EE2737] flex-row items-center">
          <Image source={icon} className="w-6 h-6 mr-1" />
          <Text style={{ color: '#EE2737' }}>{t('common.label5')}</Text>
        </View>
      </TouchableOpacity>
    })
  }, [navgation])
  const { t } = useTranslation();
  const { snap, bottomSheetModalRef, shop, onPress, shopName, showShop } = useSelectShop();



  const [data, setData] = useImmer({
    selectArea: {},
    num: 1,
    loading: false
  });
  const beginTime = data.selectArea?.businessDateVOS?.[0]?.beginTime
  const endTime = data.selectArea?.businessDateVOS?.[0]?.beginTime
  const defaultTime = dayjs(beginTime, 'HH:mm:ss').toDate()
  const defaultendTime = dayjs(endTime, 'HH:mm:ss').toDate()




  const { time,
    showTime,
    onChange,
    setShowTime } = useSelectTimer();

  const { time: time1,
    showTime: showTime1,
    onChange: onChange1,
    setShowTime: setShowTime1, setTimer } = useSelectTimer();

  useEffect(() => {
    if (beginTime) {
      setTimer((draft) => {
        draft.time = defaultTime
        draft.showTime = false
      })
    }
  }, [beginTime])

  const formatDay = dayjs(time).format('YYYY-MM-DD');


  const formatTimer = dayjs(time1).format('HH:mm');


  //当选择的区域变化的时候
  const changeArea = async (list: any, index: number) => {
    setData(draft => {
      draft.selectArea = list[index];
    });
  };

  const changeLoading = (loading: boolean) => {
    setData((draft) => {
      draft.loading = loading
    })
  }


  const checkTime = (selectDate: Date) => {

    if (selectDate < defaultTime || selectDate > defaultendTime) {
      Toast.show({
        text1: '该时间未营业'
      })

      setTimer((draft) => {
        draft.time = defaultTime
        draft.showTime = false
      })
      return
    }

    onChange1(selectDate);

  };

  const toUrl = () => {
    console.log(data?.selectArea, '获取所选的');

    navgation.navigate('ConfirmBooth', {

      areaId: data.selectArea?.id,
      areaName: data.selectArea?.name,
      img: data?.selectArea?.seatPictureFileVO?.[0]?.fileName,
      storeId: shop.select.id,
      entranceDate: formatDay,
      latestArrivalTime: formatTimer,
      peopleNum: data.num,
    });
  };

  function toRuleUrl() {
    navgation.navigate('PresetRule', {
      type: 'BOOTH_RESERVE_RULE'
    });

  }
  const disabled = data.selectArea?.id == undefined
  return (<BaseLayout loading={data.loading}>
    <CustomModal ref={bottomSheetModalRef} data={snap.shopList} selectValue={shop.select.id} onPress={onPress} headerText={t('common.label1')} snapPoints={['50%']} />
    <View className="flex-1">
      <View className="flex-1">
        <View className="absolute left-5  h-52 right-5 top-5 -z-10 rounded-2xl overflow-hidden">
          <ImageBackground source={card_2} resizeMode="cover" className="w-full h-full" />
        </View>
        <ScrollView>
          <Panel className="mt-52">
            {/* 选择门店 */}
            <View className="">
              <Text className="text-xs text-white font-bold opacity-50">{t('common.label1')}</Text>
              <TextInput mode="outlined" className="flex-auto bg-transparent mt-4 h-[40px]" value={shopName} showSoftInputOnFocus={false}
                outlineStyle={{ borderRadius: 10 }}
                contentStyle={{
                  height: 40, fontSize: 14
                }}
                right={<TextInput.Icon icon="chevron-down" onPress={showShop} />} onPressIn={showShop} />
            </View>
            {/* 选择时间 */}
            <View className="mt-7">
              <Text className="text-xs text-white font-bold opacity-50">{t('common.label2')}</Text>
              <TextInput mode="outlined" className="flex-auto bg-transparent mt-4 h-[40px]" showSoftInputOnFocus={false} value={formatDay} outlineStyle={{ borderRadius: 10 }}
                contentStyle={{
                  height: 40, fontSize: 14
                }}
                onPressIn={() => { setShowTime(true); }} right={<TextInput.Icon icon="calendar" onPress={() => { setShowTime(true); }} />} />
              {showTime && <MyDateTimePicker onChange={onChange} date={time} open={showTime} setOpen={setShowTime} mode="date" />}
            </View>
            {/* 最晚到场时间 */}
            <View className="mt-7">
              <Text className="text-xs text-white font-bold opacity-50">{t('reserveBooth.label1')}</Text>
              {beginTime && <TextInput mode="outlined" className="flex-auto bg-transparent mt-4 h-[40px]" showSoftInputOnFocus={false} value={formatTimer} outlineStyle={{ borderRadius: 10 }}
                onPressIn={() => { setShowTime1(true); }}
                contentStyle={{ height: 40, fontSize: 14 }}
                right={<TextInput.Icon icon="timer" onPressIn={() => { setShowTime1(true); }} />} />}
              {showTime1 && <MyDateTimePicker mode="time" onChange={checkTime} open={showTime1} date={time1} setOpen={setShowTime1} minimumDate={defaultTime} maximumDate={defaultendTime} />}
            </View>
            <View className="mt-7">
              <Text className="text-xs text-white font-bold opacity-50 mb-4">{t('common.label3')}</Text>
              <AreaList storeId={shop.select.id} date={formatDay} onChange={changeArea} changeLoading={changeLoading} />
            </View>
          </Panel>
        </ScrollView>
      </View>
      <View className="h-16  flex-col justify-center ">
        <Divider />
        <View className="flex-row  px-5  my-2">
          <Button mode={'elevated'} className="bg-[#EE2737FF] w-full" textColor="#0C0C0CFF" onPress={toUrl} disabled={disabled} >{t('confirmBooth.btn1')}</Button>
        </View>
      </View>

    </View>
  </BaseLayout>);
};


export default ReserveBooth;
