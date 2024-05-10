

import WebView from "react-native-webview"
import useFindLanguage from "../hooks/useFindLanguage"
import BaseLayout from "@components/baselayout"
import { getGenericPassword, UserCredentials } from "react-native-keychain"
import { useAsyncEffect } from 'ahooks'
import { useState } from "react"

const LoginPassword = () => {
  const { data } = useFindLanguage()
  const [token, setToken] = useState('')
  useAsyncEffect(async () => {
    const generic = await getGenericPassword();
    setToken((generic as UserCredentials).password)
  }, [])

  return <BaseLayout>
    {data.language && token && <WebView source={{
      uri: `https://club-h5.point2club.com/#/me/password?type=0&language=${data.language}&have=0&token=${token}`
    }}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />}
  </BaseLayout>
}




export default LoginPassword
