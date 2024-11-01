import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TencentImSDKPlugin, LogLevelEnum } from 'react-native-tim-js';
import { LOGIN_USER_ID, SDKAPPID, USER_SIG } from './config';




function LoginScreen({ navigation }: any) {
  const [userID, setUserID] = useState(LOGIN_USER_ID);
  const [userSig, setUserSig] = useState(USER_SIG);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await TencentImSDKPlugin.v2TIMManager.initSDK(
      SDKAPPID,
      LogLevelEnum.V2TIM_LOG_DEBUG,
      undefined,
      true,
    );
  };

  const login = async () => {
    console.log(userID, userSig);
    const { code } = await TencentImSDKPlugin.v2TIMManager.login(userID, userSig);
    // const cPush = new TimPushPlugin();
    // cPush.init({
    //   honor_buz_id: 0,
    //   honor_buz_id_abroad: 0,
    // });
    if (code === 0) {
      navigation.navigate('DemoHome', {
        userID: userID,
      });
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="userID"
        style={styles.textInput}
        onChangeText={setUserID}
        value={userID}
      />
      <TextInput
        placeholder="userSig"
        value={userSig}
        onChangeText={setUserSig}
        style={[
          styles.textInput,
          {
            marginBottom: 10,
          },
        ]}
      />
      <Button title="Login" onPress={login} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 50,
    width: '80%',
    backgroundColor: 'white',
    paddingLeft: 10,
  },
});

export default LoginScreen;
