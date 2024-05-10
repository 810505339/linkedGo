/* 支付结果 */

import BaseLayout from "@components/baselayout"
import { View, ScrollView, Platform, Share, } from "react-native"
import { Button, Divider, Text } from "react-native-paper"
import QRCode from "react-native-qrcode-svg"
const bg = require('@assets/imgs/order/pay.png')

import { queryPayResult } from '@api/common'
import { useRequest } from "ahooks"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "@router/type"
import { useCallback, useEffect, useRef } from "react"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { cancelOrder } from "@api/order"

import RNFS from 'react-native-fs';
import Toast from "react-native-toast-message"
import { CameraRoll } from "@react-native-camera-roll/camera-roll"

const Pay = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Pay'>>()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const qrCodeRef = useRef(null)

  const { orderId, orderStatus, codeUrl, codeExpireSecond } = route.params
  const { data, run, cancel } = useRequest(() => queryPayResult({ orderId }), {
    pollingInterval: Number(codeExpireSecond) * 1000,
    manual: true,
    onSuccess: (res) => {
      const dataRes = res.data
      if (dataRes.success) {
        console.log(dataRes.data);
        if (dataRes.data.orderStatus === 'PAY_SUCCESS') {
          // 支付成功
          cancel()
          // 跳转到成功
          navigation.replace('Result', {
            orderId: orderId,
            type: '1',
          })

        }
      }

    }
  })

  useEffect(() => {
    if (orderStatus === 'NOT_PAY') {
      run()
    }

  }, [])

  const handleToDataURL = useCallback(async (data) => {


    // json.qr is base64 string "data:image/png;base64,..."



    RNFS.writeFile(RNFS.CachesDirectoryPath + "/pay.png", data, 'base64')
      .then((success) => {
        return CameraRoll.save(RNFS.CachesDirectoryPath + "/pay.png")
      })
      .then((res) => {
        Toast.show({
          text1: '保存成功'
        })
        console.log(res);

      })

  }, [])
  const handleClick = useCallback(() => {
    qrCodeRef.current!.toDataURL(handleToDataURL)
  }, [qrCodeRef])


  const cancelPay = async () => {

    const cancelRes = await cancelOrder(orderId)
    console.log(cancelRes, 'cancelRes');
    if (cancelRes.success) {
      navigation.replace('Orders')

    }

  };



  let base64Logo = `data:image/png;base64,${data?.data?.data?.codeUrl ?? codeUrl}`
  return <BaseLayout source={bg}>
    <ScrollView className=" rounded-t-3xl bg-[#101010] flex-1">
      <View className=" py-5 px-14">
        <Text className="text-center font-bold text-lg">待支付</Text>
        <Text className="text-[#FDAD25] font-bold text-2xl text-center my-2">S$1000.00</Text>
        <View className="flex-row items-center justify-center mt-5 mb-2.5 rounded overflow-hidden">
          <QRCode
            getRef={(ref) => qrCodeRef.current = ref}
            size={160}
            logo={{ uri: base64Logo }}
            logoBackgroundColor="transparent" />
        </View>
        <View className="flex-row items-center justify-center mt-5 mb-2.5">
          <Button className="bg-[#FDAD25]  w-32 font-bold" textColor="#0C0C0CFF" labelStyle={{ fontWeight: 'bold' }} onPress={handleClick} >
            下载二维码
          </Button>
        </View>
        <Text numberOfLines={3} className="pt-2.5 pb-5  text-white mb-2.5">您可以下载二维码并使用支持PayNow的App载入二维码进行支付，也可以使用另一个手机直接扫码支付。</Text>
        <Divider />
        <View className="mt-10">
          <Text className=" text-center  opacity-75  mb-2.5 text-xs">如果支付成功后页面没有自动跳转，请点击以下按钮</Text>
          <Button textColor="#FDAD25" labelStyle={{ fontWeight: 'bold' }} onPress={run}>我已经完成付款</Button>
          <Button textColor="#ffffff" labelStyle={{ fontWeight: 'bold' }} onPress={cancelPay}>取消支付</Button>
        </View>
      </View>
    </ScrollView>
  </BaseLayout>
}


export default Pay
