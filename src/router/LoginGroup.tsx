import { Stack } from './index';
import Login from '@pages/LoginScreen/login/index';
import NewUser from '@pages/LoginScreen/set-password/newUser';
import OldUser from '@pages/LoginScreen/set-password/oldUser';
import LoginOrRegister from '@pages/LoginScreen/login/loginOrRegister';
import Verification from '@pages/LoginScreen/verification/index';

import AuthenticationSex from '@pages/LoginScreen/authentication/sex';
import AuthenticationPower from '@pages/LoginScreen/authentication/power';
import Authentication from '@pages/LoginScreen/authentication/index';
import AuthenticationFacestatus from '@pages/LoginScreen/authentication/facestatus';
import WeChat from '@pages/LoginScreen/login/media/wechat'
import UserInfo from '@pages/LoginScreen/userinfo';

import { Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

// import AuthenticationCamera from '@pages/loginScreen/authentication/camera';

// import UserInfo from '@pages/loginScreen/userinfo/index';
const red = require('@assets/imgs/nav/red.png')
const LoginGroup = () => {

  const { t } = useTranslation();

  return <Stack.Group screenOptions={{ headerLeft: () => <Image source={red} className='w-6 h-6 mr-4' /> }} >
    <Stack.Screen
      name="Login"
      options={{ title: '' }}
      component={Login}
    />
    <Stack.Screen
      name="LoginOrRegister"
      options={{ title: t('default.titleList.loginOrRegister') }}
      component={LoginOrRegister}
    />
    <Stack.Screen
      name="NewUser"
      component={NewUser}
      options={{ title: t('default.titleList.loginOrRegister') }}
    />
    <Stack.Screen
      name="OldUser"
      component={OldUser}
      options={{ title: t('default.titleList.OldUser') }}
    />
    <Stack.Screen
      name="Verification"
      component={Verification}
      options={{ title: t('default.titleList.Verification') }}
    />
    <Stack.Screen
      name="AuthenticationSex"
      component={AuthenticationSex}
      options={{ title: t('default.titleList.AuthenticationSex') }}
    />
    <Stack.Screen
      name="AuthenticationPower"
      component={AuthenticationPower}
      options={{ title: t('default.titleList.AuthenticationPower') }}
    />
    <Stack.Screen
      name="Authentication"
      component={Authentication}
      options={{ title: t('default.titleList.Authentication') }}
    />



    <Stack.Screen
      name="UserInfo"
      component={UserInfo}

      options={{ title: t('default.titleList.UserInfo') }}
    />

    <Stack.Screen
      name="AuthenticationFacestatus"
      component={AuthenticationFacestatus}
      options={{ title: t('default.titleList.AuthenticationFacestatus') }}
    />


    <Stack.Screen
      name="WeChat"
      component={WeChat}
      options={{ title: 'WeCht' }}
    />


  </Stack.Group>;
};

export default LoginGroup;
