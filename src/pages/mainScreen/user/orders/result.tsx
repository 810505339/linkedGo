import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { Image, ImageBackground, View, useWindowDimensions } from "react-native"
import { Button, Text } from "react-native-paper"
import { RootStackParamList } from "@router/type"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { getOrderDetail, tempPay } from "@api/order"
import { getImage, IOrderType } from "./index"
import { useTranslation } from "react-i18next"
import useSelectShop from "@hooks/useSelectShop"

const bg = require('@assets/imgs/user/result-bg.png')
const card = require('@assets/imgs/user/result-card.png')

const Result = () => {
  const window = useWindowDimensions()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'Result'>>();
  const { orderId } = route.params
  const { snap, bottomSheetModalRef, shop, onPress, shopName, showShop } = useSelectShop();
  const { t } = useTranslation()




  const handleClose = () => {
    navigation.reset({
      index: 0,
      routes: [
        { name: 'HomeTabs' },
      ],
    });
  }

  const handleItemPress = async () => {
    navigation.reset({
      index: 1,
      routes: [
        { name: 'HomeTabs' },
        { name: 'Orders' },

      ],
    });

    const { data } = await getOrderDetail(orderId);


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
        { label: t('orderInfo.mode1'), value: data?.orderNo },
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
      orderContext: getOrderContext(data.orderType),
      headerImg: getImage(data.orderType, data.picturePreviewUrl),
      submit: async () => {

      },
      amount: data.originalAmount, /* 应付金额 */
      realAmount: data.realAmount,
      orderStatus: data.orderStatus,
      orderId: orderId,
      storeId: shop.select.id,
      taxAmount: data.taxAmount,
      feeAmount: data.feeAmount,
      balanceAmount: data.balanceAmount,
      discountAmount: data.discountAmount,
      needCheckPayPassword: data.needCheckPayPassword,
      payMethod: data?.payMethod,
      otherAmount: data?.otherAmount
    });
  };

  return <View>
    <ImageBackground source={bg} className=" absolute" style={{ height: window.width, width: window.width }} />
    <Image source={card} className="mx-5 mt-40" style={{ width: window.width - 40, height: 208 }} resizeMode="contain" />
    <View className=" items-center mt-10">
      <Text style={{ fontSize: 24 }} className=" font-bold">{t('Result.tag1')}</Text>
      <Text className="mt-5">{t('Result.tag2')}</Text>
    </View>
    <View className="flex-row items-center mt-10 justify-center">
      <Button
        mode="outlined"
        style={{ borderColor: '#FFF', height: 50, borderRadius: 33, marginRight: 20, paddingHorizontal: 20, opacity: 0.5 }}
        labelStyle={{
          fontSize: 18,
          color: '#FFF',
          fontWeight: '600',
        }}
        contentStyle={{ height: 50 }}
        onPress={handleClose}
      >
        {t('Result.tag3')}
      </Button>
      <Button
        mode="outlined"
        style={{ borderColor: '#FFF', height: 50, borderRadius: 33, paddingHorizontal: 20 }}
        labelStyle={{
          fontSize: 18,
          color: '#FFF',
          fontWeight: '600',
        }}
        contentStyle={{ height: 50 }}
        onPress={handleItemPress}
      >
        {t('Result.tag4')}
      </Button>
    </View>
  </View >
}

export default Result
