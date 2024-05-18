import BaseLayout from "@components/baselayout"
import WebView from "react-native-webview"

const Service = () => {
  return <BaseLayout>
    <WebView startInLoadingState={true}
      source={{
        uri: 'https://club-h5.point2club.com/#/me/shop?header=0'
      }}
      originWhitelist={['https://*', 'git://*']}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />
  </BaseLayout>
}


export default Service
