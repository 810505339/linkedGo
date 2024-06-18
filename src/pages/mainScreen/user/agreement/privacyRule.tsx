import BaseLayout from "@components/baselayout"
import WebView from "react-native-webview"
import useLanguageSelect from "../hooks/useFindLanguage"

const PrivacyRule = () => {

  const { data } = useLanguageSelect()
  return <BaseLayout>
    {data.language && <WebView startInLoadingState={true}
      source={{
        uri: `https://m.point2club.com#/rule?type=PRIVACY_AGREEMENT&language=${data.language}&have=0`
      }}
      originWhitelist={['https://*', 'git://*']}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />}

  </BaseLayout>
}

export default PrivacyRule
