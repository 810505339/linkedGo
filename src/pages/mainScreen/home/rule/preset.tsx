import BaseLayout from "@components/baselayout"
import WebView from "react-native-webview"
import useLanguageSelect from "@pages/mainScreen/user/hooks/useFindLanguage"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "router/type"

const PresetRule = () => {
  const { data } = useLanguageSelect()
  const route = useRoute<RouteProp<RootStackParamList, 'PresetRule'>>();
  console.log(route.params)
  return <BaseLayout>
    {data.language && <WebView startInLoadingState={true}
      source={{
        uri: `https://m.point2club.com#/rule?type=${route.params.type}&language=${data.language}&have=0`
      }}
      originWhitelist={['https://*', 'git://*']}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />}
  </BaseLayout>
}


export default PresetRule
