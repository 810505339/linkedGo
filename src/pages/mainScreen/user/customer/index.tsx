
import WebView from "react-native-webview"
import useFindLanguage from "../hooks/useFindLanguage"
import BaseLayout from "@components/baselayout"
import { getGenericPassword, UserCredentials } from "react-native-keychain"
import { useAsyncEffect } from 'ahooks'
import { useState } from "react"
import CheckAuthLayout from "@components/baselayout/checkLayout"
import { ActivityIndicator, View, useWindowDimensions } from "react-native"




const Customer = () => {
  const { data } = useFindLanguage()
  const [token, setToken] = useState('')
  const window = useWindowDimensions()


  useAsyncEffect(async () => {
    const generic = await getGenericPassword();
    setToken((generic as UserCredentials).password)
  }, [])

  console.log(data.language);


  return <BaseLayout>
    <CheckAuthLayout />
    {data.language && <WebView

      source={{
        uri: `https://club-h5.point2club.com/#/me/opinion?type=0&language=${data.language}&have=0&token=${token}`
        // uri: 'https://club-h5.point2club.com/'
      }}
      originWhitelist={['https://*', 'git://*']}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />}
  </BaseLayout>
}
export default Customer
