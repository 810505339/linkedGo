import BaseLayout from '@components/baselayout';
import { useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import PswInput from './components/pswInput';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@router/type';
import { useRequest } from 'ahooks';
import { loginApi } from '@api/login';
import { useImmer } from 'use-immer';
import Toast from 'react-native-toast-message';
import useLogin from '../hooks/useLogin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
const bgImage = require('@assets/imgs/login/login-register-bg.png');

const OldUser = () => {
  const [allData, setAllData] = useImmer({
    password: '',
  });
  const route = useRoute<RouteProp<RootStackParamList, 'OldUser'>>();
  const { phone, phoneAreaCode } = route.params;
  const { t } = useTranslation()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const { handleLogin, loading } = useLogin({ username: phone, password: allData.password, grant_type: 'password', phoneAreaCode: phoneAreaCode }, navigation)

  function onChangeText(pwd: string) {
    setAllData(draft => {
      draft.password = pwd;
    });
  }

  async function test() {
    if (!allData.password) {
      Toast.show({
        text1: t('login.tag10'),
      });
      return;
    }
  }

  const pwdLogin = async () => {
    test();
    handleLogin()
  }

  return (
    <BaseLayout source={bgImage} loading={loading}>
      <View className="mx-5 mt-11">
        <PswInput label={t('login.tag10')} isBg={true} onChangeText={onChangeText} />
      </View>
      <View className="absolute left-5 right-5 bottom-0  h-32">
        <Button
          mode="outlined"
          style={{
            borderColor: '#FFFFFF',
            height: 50,
            borderRadius: 33,
          }}
          labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
          contentStyle={{ height: 50 }} onPress={pwdLogin}>
          {t('login.btn4')}
        </Button>
      </View>
    </BaseLayout>
  );
};

export default OldUser;
