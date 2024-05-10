import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { RootStackParamList } from '@router/type';
import BaseLayout from '@components/baselayout';
import { useCountdown } from '@hooks/useCountdown';
import { useCallback, useEffect, useState } from 'react';
import VerificationCodeField from './component/VerificationCodeField';
import { sendYzmApi } from '@api/login';
import { useRequest } from 'ahooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { remapProps } from 'nativewind';
import useLogin from '../hooks/useLogin';
import { useTranslation } from 'react-i18next';

remapProps(Text, {
  clssName: 'style'
})

const bgImage = require('@assets/imgs/login/login-register-bg.png');
const Verification = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Verification'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation()

  const mobile = route.params.phone;
  const authCode = route.params.authCode;
  const phoneAreaCode = route.params.phoneAreaCode;

  console.log(mobile, 'mobile');

  const [isResend, setIsResend] = useState(false);
  const { count, start, stop } = useCountdown(60);
  const [code, setCode] = useState('');
  const { handleLogin, loading } = useLogin({ code, mobile, authCode, phoneAreaCode }, navigation)
  const { runAsync } = useRequest(() => sendYzmApi({ mobile, phoneAreaCode }), {
    manual: true,
  });

  const sendVerification = async () => {
    setIsResend(true);
    start();

    await runAsync();

  };


  const codeChange = useCallback((value: string) => {
    setCode(value);
  }, []);


  useEffect(() => {
    if (count == 0) {
      setIsResend(false);
    }
  }, [count, stop]);

  const ResendRender = (
    <Text>
      {t('login.tag5')}
      <Text className="text-white" style={{ fontWeight: 'bold' }} onPress={sendVerification}>
        {t('login.tag6')}
      </Text>
    </Text>
  );

  const CountdownRender = (
    <Text className='font-bold'>
      <Text className="text-[#EE2737] font-bold">{count}s</Text>{t('login.tag9')}
    </Text>
  );

  return (
    <BaseLayout source={bgImage} loading={loading}>
      <View className="mx-5 mt-11">
        <Text className="text-[#FFFFFF] font-300">{t('login.tag4')}</Text>
        <View className="mt-4">
          <View>
            <VerificationCodeField onChange={codeChange} />
          </View>
          <View className="mt-6 flex-row items-center justify-center text-center">
            {isResend ? CountdownRender : ResendRender}
          </View>
        </View>
      </View>

      <View className="absolute left-5 right-5 bottom-0 h-36">
        <Button
          mode="outlined"
          style={{
            borderColor: '#FFFFFF',
            height: 50,
            borderRadius: 33,
          }}
          labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
          contentStyle={{ height: 50 }} onPress={() => handleLogin()}>
          {t('login.btn4')}
        </Button>
      </View>
    </BaseLayout>

  );
};

export default Verification;
