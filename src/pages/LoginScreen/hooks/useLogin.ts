import { loginApi } from '@api/login';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRequest } from 'ahooks';
import { RootStackParamList } from '@router/type';
import { TencentImSDKPlugin } from 'react-native-tim-js';


export type ILoginData = {
  phone?: string,
  password?: string,
  grant_type?: 'password',
  code?: string,
  username?: string,
  mobile?: string
  authCode?: string
  phoneAreaCode?: string
}

export default (loginData: ILoginData, navigation: NativeStackNavigationProp<RootStackParamList>) => {

  const { runAsync, loading } = useRequest(() => loginApi({
    ...loginData
  }), {
    manual: true,
    onSuccess: (res) => {
      handleLoginOut(res)
    }
  });

  const handleLogin = async () => {
    await runAsync();
  }

  /* 登录以后的东西 */
  const handleLoginOut = async (res: any) => {
    const loginRes = await TencentImSDKPlugin.v2TIMManager.login(res?.user_id, res?.user_info?.userSig);
    //没有人脸去人脸识别
    if (res?.user_info?.firstLogin) {
      navigation!.navigate('AuthenticationSex');
      return;
    }

    //设置信息
    if (!res?.user_info?.setPersonalInfo) {
      navigation!.navigate('UserInfo');
      return;
    }

    navigation!.navigate('HomeTabs');
  }


  return {
    handleLogin,
    handleLoginOut,
    loading,
  }
}
