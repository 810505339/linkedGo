import BaseLayout from "@components/baselayout"
import WebView from "react-native-webview"

const Service = () => {
  return <BaseLayout>
    <WebView source={{
      uri: 'https://club-h5.point2club.com/#/me/shop?header=0'
    }}
      style={{ flex: 1, backgroundColor: '#222222FF' }} />
  </BaseLayout>
}


export default Service
