import BaseLayout from '@components/baselayout';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { RootStackParamList, ScreenNavigationProp } from '@router/type';
import useUserInfo from '@hooks/useUserInfo';
import { useTranslation } from 'react-i18next';

const bgImage = require('@assets/imgs/login/login-register-bg.png');
const successImage = require('@assets/imgs/login/success.png');
const errorImage = require('@assets/imgs/login/error.png');
const DURATION = 500;

const Facestatus = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'AuthenticationFacestatus'>>();
  const navigation = useNavigation<ScreenNavigationProp<'UserInfo'>>();
  const { userInfoStorage, save } = useUserInfo();
  const { t } = useTranslation()
  //1 or 0
  const status = route.params.status;

  const error = '可能原因:第三方检测错误';
  const stateImage = status === 1 ? successImage : errorImage;
  const opacity = useSharedValue(0);
  const mt = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    marginTop: mt.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: DURATION });
    mt.value = withTiming(50, { duration: DURATION });
  }, [opacity, mt]);


  function handleNext() {
    if (status === 0) {
      navigation.goBack();
      return;
    }
    const { userInfo } = userInfoStorage;/* 获取用户信息 */
    console.log(userInfo);

    //如果没有设置过信息先去设置信息
    if (!userInfo?.setPersonalInfo) {
      navigation.navigate('UserInfo');
      return;
    }

    navigation.replace('HomeTabs');
  }


  return (<BaseLayout source={bgImage} >
    <View className="pt-16">
      <Animated.View className="rounded-full w-28 h-28  mx-auto" style={[style]} >
        <Animated.Image source={stateImage} className="rounded-full w-28 h-28" />
      </Animated.View>
      <View>
        <Text className="text-[#fff] font-bold text-2xl text-center mt-5 mb-3">{status == 1 ? t('facestatus.btn1') : t('facestatus.btn2')}</Text>
        <Text className="text-[#fff]  text-xs mx-8 text-center">{status == 1 ? t('facestatus.tag1') : t('facestatus.tag2')}</Text>
      </View>
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
        {status == 1 ? t('facestatus.tag3') : t('facestatus.tag4')}

      </Button>
    </View>
  </BaseLayout>);

};


export default Facestatus;
