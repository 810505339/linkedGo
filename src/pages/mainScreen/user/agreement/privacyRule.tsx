import BaseLayout from "@components/baselayout"
import WebView from "react-native-webview"
import useLanguageSelect from "../hooks/useFindLanguage"

const PrivacyRule = () => {

  const { data } = useLanguageSelect()
  return <BaseLayout>
    {data.language && <WebView source={{
      uri: `https://club-h5.point2club.com/#/rule?type=PRIVACY_AGREEMENT&language=${data.language}&have=0`
    }}
    style={{ flex: 1, backgroundColor: '#222222FF' }} />}

  </BaseLayout>
}

export default PrivacyRule
