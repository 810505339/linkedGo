import BaseLayout from '@components/baselayout';
import { Text, IconButton, Divider, Checkbox, Button, RadioButton, Portal, Modal } from 'react-native-paper';
import { ScrollView, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@router/type';
import Panel from '@components/panel';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { useEffect, useRef } from 'react';
import { useRequest, useDebounceFn } from 'ahooks';
import { discounts } from '@api/coupon';
import { getBalanceInfo } from '@api/balance';
import { ORDERSATUS } from './type';
import Dialog from '@components/dialog';
import { cancelOrder, orderPay } from '@api/order';
import { useImmer } from 'use-immer';
import Toast from 'react-native-toast-message';
import { cssInterop } from 'nativewind'
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import PswInput from '@pages/LoginScreen/set-password/components/pswInput'
import usesetPwd from './hooks/usesetPwd';
import currency from 'currency.js'
import { getCustomerCoupon } from '@api/coupon';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyModal from '@components/modal';
cssInterop(Text, {
  className: 'style'
})
const bg = require('@assets/imgs/order/bg.png')
const header = require('@assets/imgs/order/header.png')
const white = require('@assets/imgs/nav/white.png')
const containerStyle = { background: '#1E1E1E', padding: 20, margin: 20 };
const Payment = [
  // { label: '微信支付', icon: require('@assets/imgs/user/wechat.png') },
  // { label: '支付宝支付', icon: require('@assets/imgs/user/alipay.png') },
  { label: 'PayNow', icon: require('@assets/imgs/user/paynow.png') },
  // { label: '余额支付', icon: require('@assets/imgs/user/balance.png') },
];

/* 详情重新渲染 */
const Info = (props: any) => {
  const { orderContext, payList, orderStatus, realAmount, headerImg, payMethod, otherAmount } = props
  const { t } = useTranslation()
  return <ScrollView className='px-5'>
    <View className="relative">
      {headerImg && <View className="   h-52  rounded-2xl overflow-hidden">
        <Image source={headerImg} resizeMode="cover" className="h-52 w-full absolute left-0 right-0" />
      </View>}
    </View>
    <Text className=' font-bold  text-[#fff] my-5'>{t('orderInfo.tag19')}</Text>
    {orderContext && orderContext?.map((item, index) => {
      if (item.value == null) {
        return null;
      }

      return (<View key={index} className="flex-row  items-center justify-between mb-2.5 ">
        <Text className="text-xs font-light text-[#ffffff7f]">{item.label}:</Text>
        <Text numberOfLines={6} className='text-right text-[#fff]'>{item.value}</Text>
      </View>);
    })}

    <View className="mt-3">
      <Text className=' font-bold  text-[#fff] mb-5'>{t('orderInfo.mode4')}</Text>
      {payList.map((item, index) => {
        if (!item.show) {
          return null;
        }
        return (<View key={index} className="flex-row  items-center justify-between py-1">
          <Text className="text-xs font-light text-[#ffffff7f]">{item.label}:</Text>
          <Text className="w-56 text-right text-base font-bold " style={{ color: item.color }}>{item.value}</Text>
        </View>);
      })}
    </View>
    {orderStatus === 'PAY_SUCCESS' && <View className='my-5'>
      <Text className=' font-bold  text-[#fff]'>{t('orderInfo.tag11')}</Text>
      <Divider className='my-2' />
      <View className='flex-row items-center justify-between'>
        <Text className="text-xs font-light text-[#ffffff7f]">{payMethod}</Text>
        <Text className='text-[#E6A055] font-bold text-xl ml-2'>S${otherAmount}</Text>
      </View>
    </View>}

    <View className='flex-row items-center justify-between mt-5'>
      <View className='flex-row items-center'>
        <Text className='text-xs font-light text-[#ffffff7f]'>{t('preset.label3')}</Text>
        <Text className='text-[#E6A055] font-bold text-xl ml-2'>S$ {realAmount} </Text>
      </View>
      <Text className='text-[#fff] text-xl'>{t(`orders.${orderStatus}`)}</Text>
    </View>
  </ScrollView>
}


const OrdersInfo = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'OrdersInfo'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orderContext = [], headerImg, submit, orderStatus, orderId, taxAmount = 0, feeAmount = 0, discountAmount, realAmount, balanceAmount = 0, useScope, ticketId, storeId, boothId, winePartyMode, activityId, payMethod, otherAmount } = route?.params;

  const [allData, setAllData] = useImmer({
    visible: false,
    playType: 'PayNow',
    /* 未设置支付密码弹窗 */
    psdVisible: false,
    /* 设置支付密码弹窗 */
    isPsdVisible: false,
    //设置余额支付
    isBalance: false, /* 是否余额支付 */
    /* 是否显示密码*/
    isShowPwd: false,
    verificationCode: '',
    payPassword: '',/* 设置密码 */
    newPayPassword: '',/* 再次输入密码 */
    PayPasswordNow: '',/* 支付的密码 */
    /* 是否显示优惠券*/
    isShowCoupon: false,
    /* 订单loading */
    loading: false
  });
  const { t } = useTranslation()
  /* 需要支付的钱 */
  const { data: couponAmount, run } = useRequest(discounts, {
    manual: true,
    onSuccess: (res: any) => {
      console.log(res, '获取成功');
    },
  });
  /* 优惠券列表 */
  const { run: couponRun } = useRequest(getCustomerCoupon, {
    manual: true,
    onSuccess: (res: any) => {
      if (res?.success) {
        if (res?.data) {
          setAllData((draft) => {
            draft.isShowCoupon = true
          })
        }

      }
      console.log(res, '获取成功');
    },
  })

  useEffect(() => {
    if (!orderStatus) {
      couponRun({ available: true, useScope, ticketId, storeId, boothId, winePartyMode })
    }
  }, [])

  const { loading, runAsync } = useRequest(orderPay, {
    manual: true,
  })
  /* 查询余额 */
  const { data: balance, run: balanceRun } = useRequest(getBalanceInfo, {
    manual: true,
  })

  /* overId的值 */
  const orderIdRef = useRef('')
  const { phone, setPayPassword } = usesetPwd(allData.isShowPwd)
  /* 当存在couponId 也就是选中了优惠券 */
  useEffect(() => {
    console.log(route.params?.couponId);

    if (route.params?.couponId) {
      run({ couponCusId: route.params?.couponId, amount: route.params?.amount });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    route.params?.couponId,
  ]);
  useEffect(() => {
    balanceRun()
  }, [])

  useEffect(() => {
    if (orderStatus) {
      navigation.setOptions({
        title: ''
      })
    }

  }, [navigation, orderStatus])
  /* 是否选择优惠券 */
  const couponNum = route.params?.couponId ? 1 : 0;
  /*   */
  const tempAmount = !couponNum ? route.params?.amount : couponAmount?.data
  const temptaxAmount = currency(taxAmount).divide(route.params?.amount || 0).multiply(tempAmount)
  const tempfeeAmount = currency(feeAmount).divide(route.params?.amount || 0).multiply(tempAmount)
  let amount: number | currency = currency(tempAmount).add(temptaxAmount).add(tempfeeAmount).value;
  /* 总的余额 */
  const totalBalance = balance?.data?.totalBalance ?? 0
  /* 如果大于0证明余额多 */
  /* 临时减去的显示 */
  const tempBalance = currency(totalBalance).subtract(amount).value > 0 ? amount : currency(totalBalance).value;
  /* 选中的优惠券要减去的 */
  const couponUnAmount = currency(route.params?.amount ?? 0).subtract(couponAmount?.data)
  /* 如果要用余额支付要见一下临时的 */
  if (allData.isBalance) {
    amount = currency(amount).subtract(tempBalance).value
  }

  const payList = [
    { label: t('orderInfo.tag30'), value: `S$ ${route.params?.amount}`, color: '#fff', show: orderStatus === undefined },
    { label: t('orderInfo.tag13'), value: `-S$ ${couponUnAmount}`, color: '#FF2C2CFF', show: couponNum },
    /* 系统算的优惠 */
    { label: t('orderInfo.tag13'), value: `-S$ ${discountAmount}`, color: '#FF2C2CFF', show: discountAmount },
    { label: t('orderInfo.tag34'), value: `-S$ ${balanceAmount}`, color: '#FF2C2CFF', show: balanceAmount },
    { label: t('orderInfo.tag34'), value: `-S$ ${tempBalance}`, color: '#FF2C2CFF', show: allData?.isBalance },
    { label: t('orderInfo.tag31'), value: `S$ ${taxAmount}`, color: '#E6A055FF', show: taxAmount },
    { label: t('orderInfo.tag32'), value: `S$ ${feeAmount}`, color: '#E6A055FF', show: feeAmount },
    { label: t('orderInfo.tag33'), value: `S$ ${realAmount}`, color: '#E6A055FF', show: realAmount },
    { label: t('orderInfo.tag33'), value: `S$ ${amount}`, color: '#E6A055FF', show: orderStatus === undefined },
  ];
  const toUrl = () => {
    navigation.navigate('CouponsModal', {
      useScope: useScope,
      activityId: activityId,
      ticketId: ticketId,
      boothId: boothId,
      winePartyMode: winePartyMode,
      storeId: storeId,
    });
  };
  /* 点击取消订单确定 */
  const confirm = async () => {
    const res = await cancelOrder(route.params?.orderId);
    if (res.success) {
      onDismiss();
      Toast.show({
        text1: '取消成功',
      });
      navigation.goBack();
    }

  };
  /* 点击取消订单取消 */
  const onDismiss = () => {
    setAllData(draft => {
      draft.visible = false;
    });
  };
  /* 提交订单 */
  const handleSubmit = useDebounceFn(async () => {
    /* 没设置密码 */
    if (!setPayPassword && allData.isBalance) {
      setAllData((draft) => {
        draft.psdVisible = true
      })
      return
    }
    /* 如果设置了密码并且用余额支付的话 */
    if (setPayPassword && allData.isBalance) {
      setAllData((draft) => {
        draft.isPsdVisible = true
      })
      return
    }
    await pay()

  }, { wait: 500, leading: true, trailing: false })
  /* 支付 */
  async function pay() {
    if (loading) { return }

    try {


      /* 当orderid没值的时候 */
      if (!orderIdRef.current && !orderId) {
        setAllData(draft => {
          draft.loading = true
        })
        const res = await submit?.({
          couponCusId: route.params?.couponId,
          useBalance: allData.isBalance,
          payMethod: "PAYNOW",
        })
        orderIdRef.current = res?.orderId ?? ''
        setAllData(draft => {
          draft.loading = false
        })
      }


      /* 支付 */
      const res1 = await runAsync({
        orderId: orderId ?? orderIdRef.current,
        otherAmount: amount,
        balanceAmount: allData.isBalance ? tempBalance : 0,
        payMethod: "PAYNOW",
        payPassword: allData.PayPasswordNow,
      })
      if (res1?.data?.success) {
        console.log(res1.data.data, '支付的时候拿到的结果');
        const res1Data = res1.data.data;
        if (res1Data?.orderStatus === 'PAY_SUCCESS') {
          navigation.replace('Result', {
            orderId: orderId ?? orderIdRef.current,
            type: '1',
          })
        } else {
          navigation.navigate('Pay', {
            orderId: res1Data?.orderId,
            orderStatus: res1Data?.orderStatus,
            codeUrl: res1Data?.codeUrl,
            codeExpireSecond: res1Data?.codeExpireSecond
          })
        }

      }


    } catch (err) {
      Toast.show({
        text1: '提交订单失败',
      })
    }
  }
  /* 点击下一步 */
  async function next() {

    await pay()
  }
  /* 点击继续支付 */
  async function continuePay() {
    /* 支付 */
    if (route.params?.needCheckPayPassword) {
      setAllData((draft) => {
        draft.isPsdVisible = true
      })
      return
    }
    await pay()


  }
  const Nav = () => {
    if (orderStatus === ORDERSATUS.未支付 || orderStatus === undefined) {
      const className = orderStatus === undefined ? 'px-4 py-2' : 'flex-row justify-around items-center';
      return <View className={`${className} mt-2 h-14`}>
        <Divider className="absolute top-0 left-0 right-0" />
        {orderStatus === undefined && (
          <View className='flex flex-row items-center justify-between' >
            <View>
              <Text style={{ fontSize: 10 }}>{t('orderInfo.nav1')}:<Text className='text-[#E6A055FF]  text-[10px]'>S$</Text><Text className='text-[#E6A055FF] text-[24px] font-bold'>{amount}</Text></Text>
            </View>
            <Button className="bg-[#EE2737FF]    w-28 font-bold" textColor="#0C0C0CFF" onPress={() => handleSubmit.run()}>
              {t('orderInfo.nav2')}
            </Button>
          </View>
        )}
        {orderStatus != undefined && orderId != undefined && (<>
          <Button mode={'elevated'} textColor="#ffffff" onPress={() => setAllData(draft => { draft.visible = true; })}>{t('orders.btn1')}</Button>
          <Button mode={'elevated'} className="bg-[#EE2737FF]" textColor="#0C0C0CFF" onPress={continuePay}  >{t('orders.btn2')}</Button>
        </>)}
      </View>;
    }
  };
  /* 设置密码 */
  async function handleClick() {

    const res = await setPayPassword({
      verificationCode: allData.verificationCode,
      payPassword: allData.payPassword,
      newPayPassword: allData.newPayPassword,
    })
    if (res.data.success) {
      setAllData((draft) => {
        draft.psdVisible = false;
      })
    }



  }




  const SetPwd = allData.isShowPwd && (<View className='bg-[#222222]  rounded-2xl px-6 py-6' >
    <Text className=' text-center font-bold text-lg'>{t('oderInfo.modal4')}</Text>
    <Text className=' text-center mt-2.5 mb-5'>{t('oderInfo.modal5')}{phone}</Text>
    <View>
      <TextInput label={t('oderInfo.modal6')} mode={'outlined'} dense={true} maxLength={4} className=' mb-6' onChangeText={(text) => { setAllData((draft) => { draft.verificationCode = text }) }} />
      <PswInput label={t('oderInfo.modal7')} mode={'outlined'} dense={true} secureTextEntry={true} keyboardType='numeric' maxLength={6} onChangeText={(text) => { setAllData((draft) => { draft.payPassword = text }) }} className=' mb-6' />
      <PswInput label={t('oderInfo.modal8')} mode={'outlined'} dense={true} secureTextEntry={true} keyboardType='numeric' maxLength={6} onChangeText={(text) => { setAllData((draft) => { draft.newPayPassword = text }) }} className=' mb-6' />
      <Text className=' opacity-75'>* {t('oderInfo.modal9')}</Text>
    </View>
    <View className='mt-10'>
      <Button mode="outlined"
        style={{
          borderColor: '#EE2737',
          height: 50,
          borderRadius: 33,
          backgroundColor: '#EE2737'
        }}
        labelStyle={{ fontSize: 18, color: '#000', fontWeight: '600' }}
        contentStyle={{ height: 50 }}
        onPress={handleClick}
      >{t('common.btn2')}</Button>
    </View>
  </View>)

  return <BaseLayout className="bg-[#0B0B0BE6]" loading={loading || allData.loading}>
    {
      orderStatus === undefined &&
      (<View className="relative">
        {headerImg && <View className=" absolute right-5 left-5  h-52  rounded-2xl overflow-hidden">
          <Image source={headerImg} resizeMode="cover" className="h-52 w-full absolute left-0 right-0" />
        </View>}
      </View>)
    }

    {orderStatus != undefined ? <Info orderContext={orderContext} payList={payList} orderStatus={orderStatus} realAmount={realAmount} headerImg={headerImg} payMethod={payMethod} otherAmount={otherAmount} /> : <ScrollView>
      <View>
        <Panel className="mt-52">
          <View>
            <Text className="text-xs text-white mb-5">{t('orderInfo.tag19')}</Text>
            {orderContext && orderContext?.map((item, index) => {
              if (item.value == null) {
                return null;
              }

              return (<View key={index} className="flex-row  items-center justify-between mb-2.5 ">
                <Text className="text-xs font-light text-[#ffffff7f]">{item.label}:</Text>
                <Text numberOfLines={6} className='w-40 text-right'>{item.value}</Text>
              </View>);
            })}
          </View>
          <Divider />


          {/* 选取优惠券状态没有的时候显示 */}
          {orderStatus === undefined && allData.isShowCoupon && (<TouchableOpacity className=" flex-row  items-center justify-between py-3.5" onPress={toUrl}>
            <Text className="text-xs font-bold text-white">{t('user.tag2')}</Text>
            <View className="flex-row items-center justify-center">
              <Text >{t('orderInfo.tag21')}<Text className="text-[#E6A055FF]"> {couponNum} </Text> {t('orderInfo.tag20')}
              </Text>
              <IconButton icon="chevron-right" size={14} className="w-5 h-3" />
            </View>
          </TouchableOpacity>)}
          <Divider />

          {/* 余额支付 */}
          {orderStatus === undefined && totalBalance > 0 && <View className="mt-4">
            <View className='flex-row items-center justify-between mb-2'>
              <Text>{t('orderInfo.modal1')}</Text>
              <RadioButton.Android value="first" status={allData.isBalance ? 'checked' : 'unchecked'} onPress={() => { setAllData(draft => { draft.isBalance = !draft.isBalance }) }} />
            </View>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className="text-xs font-light text-[#ffffff7f]">{t('orderInfo.modal2')}</Text>
              <Text>S${totalBalance}</Text>
            </View>
            <Divider />
          </View>}

          <View className="mt-3">
            {payList.map((item, index) => {

              if (!item.show) {
                return null;
              }


              return (<View key={index} className="flex-row  items-center justify-between py-1">
                <Text className="text-xs font-light text-[#ffffff7f]">{item.label}:</Text>
                <Text className="w-56 text-right text-base font-bold " style={{ color: item.color }}>{item.value}</Text>
              </View>);
            })}
          </View>
          {/* 这是选择支付方式 */}
          {orderStatus === undefined && <View className="mt-5">
            <Text className="text-xs font-bold text-white pb-2.5">{t('orderInfo.tag22')}</Text>
            <Divider />
            <RadioButton.Group onValueChange={(value) => { setAllData(draft => { draft.playType = value }) }} value={allData.playType}>
              {Payment.map((item, index) => (
                <View key={index} className="">
                  <View className="py-4 flex-row items-center relative pl-8 justify-between">
                    <Image source={item.icon} className="absolute top-auto bottom-auto " />
                    <Text>{item.label}</Text>
                    <RadioButton.Android value={item.label} />
                  </View>
                  <Divider />
                </View>
              ))}

            </RadioButton.Group>


          </View>}
        </Panel>
      </View>
    </ScrollView>}
    <SafeAreaView>
      <Nav />
    </SafeAreaView>

    {
      orderStatus === ORDERSATUS.未支付 && <Dialog visible={allData.visible} confirm={confirm} onDismiss={onDismiss} >
        <Text>{t('orderInfo.tag26')}</Text>
      </Dialog>
    }
    {/* 未设置密码弹窗 */}
    <MyModal visible={allData.psdVisible} onDismiss={() => { setAllData((draft) => { draft.psdVisible = false }) }} contentContainerStyle={containerStyle} dismissable={true}  >
      {!allData.isShowPwd && <View className="bg-[#1E1E1E] relative flex items-center rounded-b-3xl  h-80  ">
        <ImageBackground source={bg} className="w-full z-0 inset-0  h-52 rounded-t-3xl  overflow-hidden" />
        <Image source={header} className=" absolute  -top-28 " />
        <View className='absolute top-[42%]'>
          <Text className='text-center text-[18px] font-bold'>{t('orderInfo.tag24')}</Text>
          <Text className='text-center text-[18px] font-bold mt-3'>{t('orderInfo.tag27')}</Text>
        </View>
        <View className='flex-row h-24  pt-6 w-full justify-around'>
          <Button mode="outlined" className=" mr-[15px] w-[115px] h-[40px] opacity-75 border border-[#FFFFFF33]" textColor="#FFFFFFFF" onPress={() => { setAllData((draft) => { draft.psdVisible = false }) }} >{t('common.btn1')}</Button>
          <Button mode={'elevated'} className="bg-[#EE2737FF] w-[115px] h-[40px] font-bold" textColor="#000000FF" onPress={() => { setAllData((draft) => { draft.isShowPwd = true }) }} >{t('orderInfo.tag23')}</Button>
        </View>
      </View>}
      {SetPwd}
    </MyModal>

    <MyModal visible={allData.isPsdVisible} onDismiss={() => { setAllData((draft) => { draft.isPsdVisible = false }) }} contentContainerStyle={containerStyle} dismissable={true} >
      <View className="bg-[#1E1E1E] relative flex items-center rounded-b-3xl    w-full py-10 px-10">
        <Text className='font-bold  text-lg'>{t('orderInfo.modal1')}</Text>
        <PswInput label={t('orderInfo.modal3')} mode={'outlined'} keyboardType='numeric' dense={true} maxLength={6} className='w-full my-10' onChangeText={(text) => { setAllData((draft) => { draft.PayPasswordNow = text }) }} />
        <Button mode="outlined"
          style={{
            borderColor: '#EE2737',
            height: 50,
            borderRadius: 33,
            backgroundColor: '#EE2737',
            width: '100%'
          }}
          labelStyle={{ fontSize: 18, color: '#000', fontWeight: '600' }}
          contentStyle={{ height: 50 }}
          onPress={next}
        >{t('facestatus.tag3')}</Button>
      </View>

    </MyModal>
  </BaseLayout>;
};


export default OrdersInfo;
