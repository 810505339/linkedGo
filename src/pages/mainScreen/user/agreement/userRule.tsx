import WebView from "react-native-webview"
import BaseLayout from "@components/baselayout"
import useLanguageSelect from "../hooks/useFindLanguage"
const UserRule = () => {
  const { data } = useLanguageSelect()
  return <BaseLayout>
    {data.language && <WebView startInLoadingState={true}
      source={{
        uri: `https://club-h5.point2club.com/#/rule?type=SERVICE_AGREEMENT&language=${data.language}&have=0`
      }}
      originWhitelist={['https://*', 'git://*']}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />}

  </BaseLayout>
}

export default UserRule
