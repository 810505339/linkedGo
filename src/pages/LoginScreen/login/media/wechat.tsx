import BaseLayout from "@components/baselayout";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { getApiVersion, registerApp, openWXApp, sendAuthRequest, shareText } from 'react-native-wechat-lib';
export default function () {

  useEffect(() => {
   

    registerApp('wx8d956651a112bfa6', 'https://www.baidu.com/').then((res) => {
      console.log("registerApp: " + res)
      getApiVersion().then((num) => {
        openWXApp()
      })
    });

  }, []);
  return <BaseLayout>
    <Text>wechat</Text>
  </BaseLayout>
}
