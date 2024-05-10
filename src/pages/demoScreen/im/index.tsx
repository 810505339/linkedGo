import BaseLayout from '@components/baselayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { Button } from 'react-native-paper';
import { TencentImSDKPlugin, LogLevelEnum, V2TimSDKListener, V2TimValueCallback } from 'react-native-tim-js';
import { RootStackParamList } from '@router/type';


const sdkAppID = 1600009072;
const userID = 'dev2'; // 用户设置的userID
const userSig = 'eJwtzEELgjAcBfDvsnPYHPu7FLoZdihCqlsXa5v8W*Zw4oTou7fUd3u-B*9DLodzNKiOZIRFlKymjlK9e9Q4sVQDW9xJU1mLkmRxQkNSKti8qNFip4IDAAvLrD02fxMUBE*o2CwvWIdbfBgBR4CxdbW-m2L31JXOT1fO41cj3G3tadnuU1f5otyS7w8ETDFM'; // 用户计算出的userSig


const init = async () => {
  await TencentImSDKPlugin.v2TIMManager.initSDK(
    sdkAppID,
    LogLevelEnum.V2TIM_LOG_DEBUG,
    undefined,
    true,
  );
};



const IM = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    init();
  }, []);
  const handleLogin = async () => {
    const loginRes = await TencentImSDKPlugin.v2TIMManager.login(userID, userSig);
    console.log(loginRes, 'loginRes');
    if (loginRes.code == '0') {
      navigation.navigate('Chat', {
        conversation: {
          userID: userID,
          conversationID: `c2c_${123123}`,
          showName: '群聊',
          groupID: 1748986445600681985,
          type: 2,
          initialMessageList: [],
          unMount: (message: V2TimMessage[]) => { },
        },
      })
    }

   
    console.log(loginRes);
  };

  return (<BaseLayout >
    <Button onPress={handleLogin}>登录</Button>
  </BaseLayout>);
};

export default IM;
