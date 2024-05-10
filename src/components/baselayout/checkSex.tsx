
import useUserInfo from "@hooks/useUserInfo";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Image, ImageBackground, View } from "react-native";
import { Button, Modal, Text } from "react-native-paper"
import { RootStackParamList } from "@router/type";
import MyModal from "@components/modal";

const sexBg = require('@assets/imgs/modal/sex-bg.png')
const sexHead = require('@assets/imgs/modal/sex-head.png')

const CheckSex = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { userInfoStorage } = useUserInfo();
  const { userInfo } = userInfoStorage;
  const { t } = useTranslation();

  function hidden() {
    navigation.goBack()
  }

  function sure() {
    navigation.navigate('AuthenticationSex')
  }


  console.log(userInfo, 'userInfo');

  //userInfo?.checkFace ?? false
  const containerStyle = { padding: 40, zIndex: 99 };
  return (<MyModal visible={!userInfo?.checkFace ?? false} dismissable={false} contentContainerStyle={containerStyle}>
    <View className=" bg-[#1E1E1EFF] relative z-50 rounded-3xl ">
      <ImageBackground source={sexBg} className="w-full h-52 rounded-t-3xl overflow-hidden -z-10" />
      <Image source={sexHead} className="    absolute  -top-10" />
      <View className="bg-[#1E1E1EFF] ">
        <View className=" relative -top-10   ">
          <Text className=" text-center font-bold text-2xl">为了更好的拼局体验</Text>
          <Text className=" text-center font-bold text-2xl">您需要完成性别认证流</Text>
        </View>
        <View className="flex-row justify-around items-center  w-full px-5 pb-5 mt-10 ">
          <Button className="bg-transparent mr-5 w-32" mode="outlined" labelStyle={{ fontWeight: 'bold' }} textColor="#ffffffbf" onPress={hidden} >{t('common.btn1')}</Button>
          <Button className="bg-[#EE2737FF] w-32" textColor="#000000FF" labelStyle={{ fontWeight: 'bold' }} mode="contained" onPress={sure}  >{t('common.btn2')}</Button>
        </View>
      </View>
    </View>
  </MyModal>)
}

export default CheckSex
