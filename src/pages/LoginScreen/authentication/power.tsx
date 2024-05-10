import BaseLayout from '@components/baselayout';
import { useNavigation } from '@react-navigation/native';
import { Image, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ScreenNavigationProp } from '@router/type';
import Toast from 'react-native-toast-message';
import { useCameraPermission } from 'react-native-vision-camera';
import { useTranslation } from 'react-i18next';
const bgImage = require('@assets/imgs/login/login-register-bg.png');
const authorizationImage = require('@assets/imgs/login/authorization.png');
const AuthenticationPower = () => {

  const navigation = useNavigation<ScreenNavigationProp<'Authentication'>>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const { t } = useTranslation()
  const checkPermission = async () => {
    const permission = await requestPermission();
    if (!permission) {
      Toast.show({
        text1: '请授权相机',
      });
      return;
    }


    navigation.navigate('AuthenticationCamera');
  };

  const handleNext = async () => {
    await checkPermission();
  };

  const textindent = '\t\t\t\t';
  return (
    <BaseLayout source={bgImage} >
      <View className="flex items-center justify-center mt-10">
        <Image source={authorizationImage} className="w-[52] h-[60]" />
      </View>
      <View className="mt-10 mx-6">
        <Text className="text-lg text-[#fff] text-center font-bold">{t('power.tag1')}</Text>
        <Text className=" text-sm text-[#fff] my-5 leading-5" numberOfLines={4}>{textindent}{t('power.tag2')}</Text>
        <Text className="text-sm text-[#fff] leading-5" numberOfLines={4}>{textindent}{t('power.tag3')}</Text>
      </View>

      <View className="absolute left-5 right-5 bottom-0 h-32">

        <Button
          mode="outlined"
          style={{
            borderColor: '#FFFFFF',
            borderRadius: 33,
          }}
          labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
          contentStyle={{ height: 50 }}
          onPress={handleNext}
        >
          {t('power.btn1')}
        </Button>
      </View>

    </BaseLayout>
  );
};


export default AuthenticationPower;
