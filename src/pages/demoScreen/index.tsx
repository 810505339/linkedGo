import * as React from 'react';

import { StyleSheet, View, Text, Button, Alert, TextInput } from 'react-native';
import { getApiVersion, registerApp, openWXApp, sendAuthRequest, shareText, isWXAppInstalled } from 'react-native-wechat-lib';

export default function App() {
  const [versionNumber, setVersionNumber] = React.useState<string | undefined>();
  const [responseCode, setResponseCode] = React.useState<string | undefined>();

  React.useEffect(() => {
    console.log(registerApp);

    registerApp('wx8d956651a112bfa6', 'https://www.baidu.com/').then((res) => {
      console.log("registerApp: " + res)
      getApiVersion().then((num) => {
        console.log("test: " + num)
        setVersionNumber(num)
        // openWXApp().then()
      })
    });

  }, []);

  function onLogin() {
    sendAuthRequest('snsapi_userinfo', '')
      .then((response: any) => {
        // todo 登录 response.code
        console.log(response.code)
        setResponseCode(response.code)
        Alert.alert('登录成功，code: ' + response.code)
      })
      .catch(error => {
        console.log(error)
        let errorCode = Number(error.code);
        if (errorCode === -2) {
          Alert.alert('已取消授权登录')
        } else {
          Alert.alert('微信授权登录失败')
        }
      });

  }

  function onShareText() {
    shareText({
      text: 'test content.',
      scene: 0
    }).then()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Call wechat SDK demo</Text>

      <Text style={styles.versionBox} className="text-white">
        Version: {versionNumber}
      </Text>
      <TextInput value={responseCode} className="text-white" />
      <Text style={styles.versionBox} >
        responseCode: {responseCode}

      </Text>
      <View style={styles.buttonGroup}>
        <View style={styles.button}>
          <Button title={'拉起微信'} onPress={() => { openWXApp().then() }} />
        </View>
        <View style={styles.button}>
          <Button title={'授权登录'} onPress={() => { onLogin() }} />
        </View>
        <View style={styles.button}>
          <Button title={'分享'} onPress={() => { onShareText() }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  title: {
    marginTop: 48,
    fontSize: 24,

  },
  versionBox: {

  },
  buttonGroup: {
    width: '100%',
    padding: 6,
    marginTop: 24,
  },
  button: {
    margin: 6,

  }
});
