import BaseLayout from '@components/baselayout';
import { View, TouchableOpacity, Image } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';
import { TabsProvider, Tabs, TabScreen } from 'react-native-paper-tabs';

import { useImmer } from 'use-immer';

import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@router/type';

import { cancelOrder, getOrderDetail, getOrderList, tempPay } from '@api/order';
import CustomFlatList from '@components/custom-flatlist';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { fileStore } from '@store/getfileurl';
import { useTranslation } from 'react-i18next';
import Dialog from '@components/dialog';
import ListHeaderComponent from './components/ListHeaderComponent';
import { useInterval } from 'ahooks';
import { cssInterop } from 'nativewind'
const white = require('@assets/imgs/nav/white.png')

/* 预定门票 */
const card1Image = require('assets/imgs/base/card_1.png');
/* 拼酒局 */
const card2Image = require('assets/imgs/base/card_2.png');

export enum IOrderType {
  拼酒局 = 'WINE_PARTY',
  预定门票 = 'TICKET',
  预定卡座 = 'BOOTH',
  活动 = 'ACTIVITY',
}

enum IOrderStatus {
  未支付 = 'NOT_PAY',
  支付中 = 'NOT_PAY',
  支付成功 = 'PAY_FAIL',
  已取消 = 'PAY_CANCEL'
}



/* 订单图片 */
export const getImage = (orderType: IOrderType, img: string) => {
  if (orderType === IOrderType.预定门票 || orderType === IOrderType.活动) {
    return {
      uri: img,
    };
  }
  if (orderType === IOrderType.拼酒局) {
    return card2Image;
  }
  if (orderType === IOrderType.预定卡座) {
    return card1Image;
  }
};



const Item: FC<any> = ((props) => {
  const { name, orderStatus, handleItemPress, orderType, createTime, originalAmount, picture, cancel, orderId, payEndTime, realAmount, t, picturePreviewUrl } = props;
  const img = picturePreviewUrl;

  const PayEndTimeRender = (props: { payEndTime: string }) => {
    const { payEndTime } = props;
    const date1 = dayjs(payEndTime ?? new Date());
    const date2 = dayjs(new Date());
    const [seconds, setSeconds] = useState(date1.diff(date2, 'second'));
    const time = dayjs().startOf('day').second(seconds);
    const formattedTime = time.format('HH:mm:ss');
    useInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);

    return <Text className="text-xs text-[#ffffff] ">
      {t('orders.info1')}
      <Text className="text-[#EE2737FF]">{formattedTime}</Text>
      {t('orders.info2')}
    </Text>;
  };

  /*  */
  const RenderOrderStatus = () => {
    return <View className="py-2.5 mt-2.5 flex-row items-center justify-between">
      {payEndTime && <PayEndTimeRender payEndTime={payEndTime} />}
      <View className="flex-row gap-2">

        <Button mode="outlined" style={{
          borderColor: '#ee2737',
          height: 34,
        }} labelStyle={{ marginHorizontal: 5, fontSize: 12, marginVertical: 5 }}
          onPress={() => cancel(orderId)}>
          {t('orders.btn1')}
        </Button>
        <Button mode="outlined" textColor="#ffffff" style={{

          height: 34,
        }}
          labelStyle={{ marginHorizontal: 10, fontSize: 12, marginVertical: 5 }}
          onPress={() => handleItemPress(props)}
        >
          {t('orders.btn2')}
        </Button>
      </View>

    </View>;
  };




  return <TouchableOpacity onPress={() => handleItemPress(props)}>
    <View className="  bg-[#151313FF]  p-2.5   rounded-xl border  border-[#252525] m-2.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-[#FFFFFF] text-sm font-bold">{t(`orders.${orderType}`)}</Text>
        <Text className="text-xs font-normal text-[#ffffff7f]">{t(`orders.${orderStatus}`)}</Text>
      </View>

      <View className="mt-2.5 flex-row">
        <View className="w-24 h-14  rounded-md">
          <Image source={getImage(orderType, picturePreviewUrl)} className="w-24 h-14  rounded-md" />
        </View>
        <View className="flex-auto ml-2.5 mr-5">
          <Text numberOfLines={2} className="text-[#ffffff] text-sm">{name}</Text>
          <Text className="text-[#ffffff7f] text-xs">{createTime}</Text>
        </View>
        <Text>S${realAmount}</Text>
      </View>
      {orderStatus === IOrderStatus.未支付 && <RenderOrderStatus />}
    </View>
  </TouchableOpacity>;
});







const Orders = () => {

  const navigation = useNavigation<ScreenNavigationProp<'OrdersInfo'>>();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TouchableOpacity onPress={() => navigation.navigate('User')} className='ml-5'><Image source={white} className='w-6 h-6 mr-4' /></TouchableOpacity>
    })
  }, [navigation])
  const Dom = useRef();
  const { t } = useTranslation();

  console.log(t('orders.tag1'), 'orders.tag1');


  const orderStatus = [
    { title: t('orders.tag1'), type: undefined },
    { title: t('orders.item1'), type: 'NOT_PAY' },
    { title: t('orders.item2'), type: 'PAY_SUCCESS' },
    //  { title: t('orders.item3'), type: 'PAY_FAIL' },
    { title: t('orders.item4'), type: 'PAY_CANCEL' },
  ];
  const orderStatusTitle = orderStatus.map(o => o.title);

  const [data, setData] = useImmer({
    defaultIndex: 0,
    orderStatus: [t('orders.tag1'), t('orders.item1'), t('orders.item2'), t('orders.item3'), t('orders.item4')],

    typeIndex: 0,
    tabs: [
      {
        title: t('orders.tag1'),
        orderType: undefined,
      },
      {
        title: t('orders.tag2'),
        orderType: IOrderType.拼酒局,
      },
      {
        title: t('orders.tag3'),
        orderType: IOrderType.预定门票,
      },
      {
        title: t('orders.tag4'),
        orderType: IOrderType.预定卡座,
      },
      {
        title: t('orders.tag5'),
        orderType: IOrderType.活动,
      },

    ],
    visible: false,
    selectOrderId: '0',

  });

  /* 点击取消取消订单 */
  const cancel = useCallback((orderId: string) => {
    setData(draft => {
      draft.visible = true;
      draft.selectOrderId = orderId;
    });
  }, [data.selectOrderId]);

  /* 点击取消订单确定 */
  const confirm = async () => {
    const res = await cancelOrder(data.selectOrderId);
    if (res.success) {

      onDismiss();
      Dom.current!.refreshData();
    }

  };
  /* 点击取消订单取消 */
  const onDismiss = () => {
    setData(draft => {
      draft.visible = false;
    });
  };


  const handleItemPress = async (item: any) => {

    const { data } = await getOrderDetail(item.orderId);


    /* 根据不同的type获取OrderContext */

    function getOrderContext(orderType: IOrderType) {
      let initList: { label: string; value: any; }[] = []

      if (orderType === IOrderType.拼酒局) {
        initList = [
          // { label: t('orderInfo.mode2'), value: data?.productName },
          { label: t('orderInfo.mode3'), value: data?.modeName },
        ]
      }

      if (orderType === IOrderType.预定卡座) {
        initList = [
          // { label: t('orderInfo.tag16'), value: data?.productName },
        ]
      }
      if (orderType === IOrderType.预定门票) {
        initList = [
          { label: t('orderInfo.tag17'), value: data?.productName },
        ]
      }

      const list = [
        { label: t('orderInfo.mode1'), value: data?.id },
        { label: t('orderInfo.tag1'), value: data?.storeName },
        { label: t('orderInfo.tag2'), value: data?.areaName },
        { label: t('orderInfo.tag3'), value: data?.bootName },
        { label: t('orderInfo.tag4'), value: undefined },
        { label: t('orderInfo.tag5'), value: undefined },
        { label: t('orderInfo.tag6'), value: data?.useOfExpenses },
        { label: t('orderInfo.tag7'), value: data?.activityTime },
        // { label: t('orderInfo.tag8'), value: data?.createTime },
        ...initList,
        { label: t('orderInfo.tag9'), value: data?.productNum },
        { label: t('orderInfo.tag16'), value: data?.drinksMealName ?? t('confirmBooth.label3') },
        { label: t('orderInfo.tag10'), value: data?.entranceDate ? (data?.entranceDate + ' ' + (data?.latestArrivalTime ?? '')) : null },
        // { label: t('orderInfo.tag11'), value: data?.payMethod },
        // { label: t('orderInfo.tag12'), value: item.orderStatus },
        { label: t('orderInfo.tag13'), value: data?.discountAmount != 0 ? <Text className='text-[#FF2C2C]'>{'-S$' + data?.discountAmount}</Text> : null },
        { label: t('orderInfo.tag14'), value: data?.discountDetail?.name },
        { label: t('orderInfo.tag15'), value: 'S$' + data.originalAmount },
      ]

      return list
    }



    navigation.navigate('OrdersInfo', {
      orderContext: getOrderContext(item.orderType),
      headerImg: getImage(item.orderType, item.picturePreviewUrl),
      submit: async () => {

      },
      storeId: item.storeId,
      amount: item.originalAmount, /* 应付金额 */
      realAmount: item.realAmount,
      orderStatus: item.orderStatus,
      orderId: item.orderId,
      taxAmount: data.taxAmount,
      feeAmount: data.feeAmount,
      balanceAmount: data.balanceAmount,
      discountAmount: data.discountAmount,
      needCheckPayPassword: data.needCheckPayPassword,
      payMethod: data?.payMethod,
      otherAmount: data?.otherAmount
    });
  };
  const handleChangeIndex = (index: number) => {
    console.log(index);

    setData(draft => {
      draft.defaultIndex = index;
    });
  };
  const itemClick = (index: number) => {
    Dom.current!.refreshData({
      orderStatus: orderStatus[index].type
    });


    setData(draft => {
      draft.typeIndex = index;
    });
  }



  return (<BaseLayout>


    <TabsProvider
      defaultIndex={0}
      onChangeIndex={handleChangeIndex}

    >
      <ListHeaderComponent className="absolute  top-44 z-10  w-full" list={orderStatusTitle} tabIndex={data.typeIndex} itemClick={itemClick} />
      <Tabs
        uppercase={true} // true/false | default=true (on material v2) | labels are uppercase
        // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
        // iconPosition // leading, top | default=leading
        style={{ backgroundColor: 'transparent' }} // works the same as AppBar in react-native-paper
        dark={true} // works the same as AppBar in react-native-paper
        // theme={} // works the same as AppBar in react-native-paper
        mode="scrollable" // fixed, scrollable | default=fixed
        showLeadingSpace={false} //  (default=true) show leading space in scrollable tabs inside the header
        disableSwipe={false} // (default=false) disable swipe to left/right gestures
      >

        {data.tabs.map((tab, index) => {
          const orderType = data.tabs[index].orderType;
          const status = orderStatus[data.typeIndex].type;



          return (<TabScreen label={tab.title} key={index} >
            <View className='mt-20'>

              {index === data.defaultIndex && <CustomFlatList
                renderItem={(item) => <Item t={t} {...item} handleItemPress={handleItemPress} cancel={cancel} />}
                onFetchData={getOrderList}
                params={{ orderType: orderType, orderStatus: status }}
                keyExtractor={(item) => item.orderId}
                ref={Dom}
              />}
            </View>
          </TabScreen>);
        })}
      </Tabs>
    </TabsProvider>
    <Dialog visible={data.visible} confirm={confirm} onDismiss={onDismiss} confirmText={t('orders.btn3')} cancelText={t('orders.btn4')}  >
      <Text>{t('orders.tip1')}</Text>
    </Dialog>
  </BaseLayout>);
};



export default Orders;


