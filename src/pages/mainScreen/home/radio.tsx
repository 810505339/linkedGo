

import WebView from "react-native-webview"
import useFindLanguage from "@pages/mainScreen/user//hooks/useFindLanguage"
import BaseLayout from "@components/baselayout"
import { getGenericPassword, UserCredentials } from "react-native-keychain"
import { useAsyncEffect } from 'ahooks'
import { useState } from "react"
import CheckAuthLayout from "@components/baselayout/checkLayout"
import useSelectShop from "@hooks/useSelectShop"

const Radio = () => {
  const { data } = useFindLanguage()
  const [token, setToken] = useState('')
  const { shop } = useSelectShop(true)
  useAsyncEffect(async () => {
    const generic = await getGenericPassword();
    setToken((generic as UserCredentials).password)
  }, [])
  console.log(shop.select.id, 'storeId');


  return <BaseLayout>
    <CheckAuthLayout />
    {data.language && token && <WebView startInLoadingState={true}
      source={{
        uri: `https://m.point2club.com#/broadcast?language=${data.language}&have=0&token=${token}&storeId=${shop.select.id}`
      }}
      originWhitelist={['https://*', 'git://*']}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />}
  </BaseLayout>
}




export default Radio
