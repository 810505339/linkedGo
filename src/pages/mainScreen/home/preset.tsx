import BaseLayout from '@components/baselayout';
import { Image, ImageBackground, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text, TextInput, IconButton, Divider, Button } from 'react-native-paper';
import { useImmer } from 'use-immer';

import dayjs from 'dayjs';
import AreaList from './components/areaList';
import useSelectShop from '@hooks/useSelectShop';
import CustomModal from '@components/custom-modal';
import { onSaleNum } from '@api/store';
import NumberInput from '@components/number-input';
import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import Panel from '@components/panel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@router/type';
import currency from 'currency.js';
import Toast from 'react-native-toast-message';
import useSelectTimer from '@hooks/useSelectTimer';
import { useTranslation } from 'react-i18next';
import { ticketBooking } from '@api/ticket';
import MyDateTimePicker from '@components/DateTimePicker';
import TicketList from './components/ticketList'
import { findIndex, initList, store } from '@store/shopStore';
/* 预定门票 */
const tickerBg = require('@assets/imgs/home/preset/ticket-header.png');
const card_1 = require('@assets/imgs/base/card_1.png');
const icon = require('@assets/imgs/home/preset/icon.png');
const noMore = require('@assets/imgs/ticket/nomore.png')
const xiala = require('@assets/imgs/base/xiala-F.png')

const defaultData = {
  remainingNum: 0, //剩余票数
  selectAreaId: '',
  total: 0,
  ticketId: '',
  amount: 0,
  ticketName: '',
  num: 0,//默认票数
  ticketList: [],
  tickerIndex: 0,
  ticketDetailId: 0,
  selectArea: []
};


const Preset = () => {

  const { snap, bottomSheetModalRef, shop, onPress, shopName, showShop } = useSelectShop();
  const { time,
    showTime,
    onChange,
    setShowTime } = useSelectTimer();

  const navgation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();



  const { t } = useTranslation();

  const { run, refresh, loading } = useRequest(onSaleNum, {
    manual: true,
    onSuccess: (res) => {
      console.log(res, 'res');

      setData((draft) => {
        draft.ticketList = res ?? []
        const defaultTicket = res?.[0];
        draft.remainingNum = defaultTicket?.remainingNum ?? 0;
        draft.ticketId = defaultTicket?.ticketId ?? '';
        draft.amount = defaultTicket?.amount ?? 0;
        draft.num = defaultTicket?.remainingNum > 0 ? 1 : 0
        draft.total = currency(draft?.amount).multiply(draft.num).value;
        draft.ticketName = defaultTicket?.ticketName;
        draft.ticketDetailId = defaultTicket?.ticketDetailId ?? 0;

      });

    },
  });
  /* 点击提交按钮 */
  const { runAsync, loading: bookingLoading } = useRequest(ticketBooking, {
    manual: true
  })




  const [data, setData] = useImmer(defaultData);
  const formatDay = dayjs(time).format('YYYY-MM-DD');
  //当选择的区域变化的时候
  const changeArea = async (list: any, index: number) => {
    setData(draft => {
      draft.selectAreaId = list[index]?.id;
      draft.selectArea = list[index]
    });
  };



  //数量改变
  const changeSum = (sum: number) => {
    setData(draft => {
      draft.num = sum;
      draft.total = currency(draft.amount).multiply(sum).value;
    });
  };

  const toUrl = () => {
    const feeRate = findIndex(shop.select.id)?.feeRate ?? 0
    const taxRate = findIndex(shop.select.id)?.taxRate ?? 0
    const beginTime = data.selectArea?.businessDateVOS?.[0].beginTime

    console.log(data.selectArea, 'businessDateVOS');


    if (!data.num) {
      Toast.show({ text1: '数量必须大于1' });
      return;
    }
    if (!data.ticketId) {
      refresh();
      return;
    }

    const header = data.ticketList[data.tickerIndex]?.ticketPicture ?? undefined
    navgation.navigate('OrdersInfo', {
      orderContext: [
        { label: t('orders.label1'), value: shopName },
        { label: t('orders.label8'), value: data.ticketName },
        { label: t('orders.label9'), value: data.num },
        { label: t('orders.label4'), value: formatDay + ` ${beginTime}` },
        { label: t('orderInfo.tag29'), value: `S$${data.total}` },
        { label: t('orders.label7'), value: `S$${data.total}` },
      ],
      headerImg: header ? { uri: header } : card_1,
      submit: async (params: any) => {
        const res = await runAsync({
          storeId: shop.select.id,
          areaId: data.selectAreaId,
          ticketId: data.ticketId,
          ticketNum: data.num,
          entranceDate: formatDay,
          productName: data.ticketName,
          ticketDetailId: data.ticketDetailId,
          ...params,
        });
        const _data = res.data
        if (_data?.success) {
          return {
            orderId: _data?.data?.orderId,
          }
        }
      },
      useScope: 'TICKET', //使用范围
      ticketId: data.ticketId, //门票id
      storeId: shop.select.id,
      amount: `S${data.total}`,//需要支付多少钱
      taxAmount: currency(data.total).multiply(taxRate).divide(100),
      feeAmount: currency(data.total).multiply(feeRate).divide(100),

    });
  };
  /* 规则弹窗 */
  const toRuleUrl = () => {
    navgation.navigate('PresetRule', {
      type: 'TICKET_RESERVE_RULE'
    });
  }

  const selectTicket = (index: number) => {
    console.log(index);
    const selectTicket = data.ticketList[index];
    setData(draft => {
      draft.tickerIndex = index;
      draft.remainingNum = selectTicket?.remainingNum ?? 0;
      draft.ticketId = selectTicket?.ticketId ?? '';
      draft.amount = selectTicket?.amount ?? 0;
      draft.num = selectTicket?.remainingNum > 0 ? 1 : 0
      draft.total = currency(draft?.amount).multiply(draft.num).value;
      draft.ticketName = selectTicket?.ticketName;
      draft.ticketDetailId = selectTicket?.ticketDetailId ?? 0;


    })
  }



  useEffect(() => {
    console.log(shop.select.id, time, data.selectAreaId);
    if (!data.selectAreaId && shop.select.id) {
      setData((draft) => {
        Object.keys(defaultData).map(k => {
          draft[k] = defaultData[k];
        });
      });
    }

    if (shop.select.id && time && data.selectAreaId) {
      console.log('请求');

      run({
        'storeId': shop.select.id,
        'areaId': data.selectAreaId,
        'entranceDate': formatDay,
        total: 0,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    time,
    data.selectAreaId,
  ]);


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






  return (<BaseLayout className="" loading={loading || bookingLoading}>
    <CustomModal ref={bottomSheetModalRef} data={snap.shopList} selectValue={shop.select.id} onPress={onPress} headerText={t('common.label1')} snapPoints={['50%']} />
    <View className="flex-1">
      <ScrollView>
        <View className="flex-1">
          <View className="absolute w-52 h-28 right-3 top-18 z-20">
            <Image source={tickerBg} resizeMode="contain" className="w-full h-full" />
          </View>

          <Panel className="mt-20">
            {/* 选择门店 */}
            <View className="">
              <Text className="text-xs text-white font-bold opacity-50">{t('common.label1')}</Text>
              <TextInput mode="outlined" className="flex-auto bg-transparent mt-4  text-sx "
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
                onPressIn={showShop} />
            </View>
            {/* 选择时间 */}
            <View className="mt-7">
              <Text className="text-xs text-white font-bold opacity-50">{t('common.label2')}</Text>
              <TextInput mode="outlined" className="flex-auto bg-transparent mt-4  h-[40px]"
                contentStyle={{
                  height: 40,
                  fontSize: 14
                }}
                showSoftInputOnFocus={false} value={formatDay} outlineStyle={{ borderRadius: 10 }} onPressIn={() => { setShowTime(true); }} right={<TextInput.Icon icon="calendar" onPress={() => { setShowTime(true); }} />} />
              {showTime && <MyDateTimePicker onChange={onChange} date={time} open={showTime} setOpen={setShowTime} mode="date" />}
            </View>
            {/* 选择区域 */}
            <View className="mt-7">
              <Text className="text-xs text-white font-bold opacity-50 mb-4">{t('common.label3')}</Text>
              <AreaList storeId={shop.select.id} date={formatDay} onChange={changeArea} />
            </View>
            {/* 选择门票 */}
            <View className="mt-7">
              <Text className="text-xs text-white font-bold opacity-50 mb-4">{t('common.label6')}</Text>
              {data?.ticketList?.length > 0 && <TicketList onPress={selectTicket} list={data.ticketList} activeIndex={data.tickerIndex} />}
              {data?.ticketList?.length <= 0 && <View className='border border-[#343434] bg-[#191919] h-24 rounded-xl justify-center items-center flex-row'>
                <Image source={noMore} className=' w-8 h-8' />
                <Text className='text-xs  opacity-50 ml-2.5'>{t('NoMore.tag1')}</Text>
              </View>}

            </View>

            {/* 选择数量 */}
            <View className="mt-7">
              <Text className="text-xs text-white font-bold opacity-50 mb-4">{t('common.label4')}</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-[#FFFFFF]" style={{ fontSize: 10 }}>{t('preset.label1')}<Text className="text-[#E6A055FF] text-xs">{data.remainingNum}</Text>{t('preset.label2')}</Text>
                <View className="flex-row items-center">
                  <NumberInput max={data.remainingNum} min={0} num={data.num} onChange={changeSum} />
                </View>
              </View>
            </View>
          </Panel>
        </View>
      </ScrollView>
      <SafeAreaView>
        <View className="h-14  flex-col justify-center">
          <Divider />
          <View className="flex-row items-center justify-between px-5 mt-1">
            <Text style={{ fontSize: 10 }}>{t('preset.label3')}<Text className="text-[#E6A055FF]">S$</Text><Text className="text-[#E6A055FF] text-2xl font-bold" >{data.total}</Text></Text>
            <Button mode={'elevated'} className="bg-[#EE2737FF]" textColor="#0C0C0CFF" onPress={toUrl} disabled={!data.num} >{t('common.btn2')}</Button>
          </View>
        </View>
      </SafeAreaView>


    </View>
  </BaseLayout>);

};


export default Preset;
