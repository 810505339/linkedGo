import BaseLayout from '@components/baselayout';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useCameraPermission } from 'react-native-vision-camera';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from 'router/type';
import { getGenericPassword } from 'react-native-keychain';
const bgImage = require('@assets/imgs/login/login-register-bg.png');
const DURATION = 800;
const Authentication = () => {
  const navigation = useNavigation<ScreenNavigationProp<'AuthenticationCamera'>>();

  const { hasPermission, requestPermission } = useCameraPermission();
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






  return (
    <BaseLayout source={bgImage} >
      <View className="pt-24 ">
        <View>
          <Text className="text-[#fff] font-bold text-2xl text-center">您的照片</Text>
          <Text className="text-[#fff]  text-xs mx-8 text-center mt-3">请选择您本人正面、清晰、真实的照片，不要佩戴任何可能遮挡面部的饰品、道具，会更容易通过验证哦～</Text>
        </View>
        <Animated.View className="rounded-xl w-28 h-32 bg-fuchsia-700 mx-auto" style={[style]} />
      </View>
      <Animated.View className="absolute left-5 right-5 bottom-0 h-32">
        <Button
          mode="outlined"
          style={{
            borderColor: '#FFFFFF',
            borderRadius: 33,
          }}
          labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
          contentStyle={{ height: 50 }}
          onPress={checkPermission}

        >
          拍照
        </Button>
      </Animated.View>
    </BaseLayout>
  );
};


export default Authentication;
