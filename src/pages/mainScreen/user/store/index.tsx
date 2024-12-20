import BaseLayout from "@components/baselayout"
import WebView from "react-native-webview"
import useLanguageSelect from "../hooks/useFindLanguage"


const Store = () => {

  const { data } = useLanguageSelect()


  console.log(`https://m.point2club.com#/me/shop?have=0&language=${data.language}`);

  return <BaseLayout>
    {data.language && <WebView startInLoadingState={true}
      source={{
        uri: `https://m.point2club.com#/me/shop?have=0&language=${data.language}`
      }}
      originWhitelist={['https://*', 'git://*']}
      androidLayerType={'hardware'}
      mixedContentMode={'always'}
      mediaPlaybackRequiresUserAction={false}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />}

  </BaseLayout>
}


export default Store
