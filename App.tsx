import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from '@router/index';
import '@utils/i18next';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  Modal,
  Portal,
  Dialog,
  Text,
  Button,
} from 'react-native-paper';
import { Image, useColorScheme, View } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import SplashScreen from 'react-native-splash-screen';
import useSysLanguage from '@hooks/useSysLanguage.ts';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import toastConfig from '@components/toast/customToast';
import { getFileUrl } from '@store/getfileurl';
import useVersion from '@hooks/useVersion';
import './global.css';
import useImLogin from '@hooks/useImLogin';
import { ModalLayerFactory, ModalLayers } from 'react-native-modal-layer';
import { useBackHandler } from '@react-native-community/hooks';
import useUserInfo from '@hooks/useUserInfo';
import MyModal from '@components/modal';
import { useTranslation } from 'react-i18next';

const headerIcon = require('@assets/imgs/base/modalHeader.png');

const App = () => {
  const { allData, hideDialog, download } = useVersion();

  const { t } = useTranslation()
  useUserInfo();
  useImLogin();
  useSysLanguage();
  useBackHandler(() => {
    return ModalLayerFactory.back();
  });

  useEffect(() => {
    /* 这是启动页 */
    //SplashScreen.hide();
    getFileUrl();
  }, []);
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const colors = {
    ...theme.dark,
    primary: '#EE2737',
  };

  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: colors }
      : { ...MD3LightTheme, colors: colors };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalLayers>
        <BottomSheetModalProvider>
          <PaperProvider theme={paperTheme}>
            <SafeAreaProvider>
              <StatusBar backgroundColor="transparent" translucent={true} />
              <Portal>
                <MyModal
                  visible={allData.isShow}
                  onDismiss={hideDialog}
                  dismissable={false}>
                  <View className="w-[285]  bg-[#222222FF] items-center ml-auto mr-auto  rounded-2xl relative ">
                    <Image
                      source={headerIcon}
                      resizeMode="contain"
                      className="w-[285] h-[60] absolute -top-2 left-0 right-0"
                    />
                    <View>
                      <Text className="text-lg font-bold text-white  text-center pt-2">
                        {t('Modal.tip')}
                      </Text>
                    </View>
                    <View className="m-auto py-8 px-5">
                      <Text
                        className="text-xs font-bold text-white  text-center "
                        numberOfLines={2}>
                        {allData.versionIntroduce}
                      </Text>
                    </View>
                    <View className="flex-row justify-around items-center  w-full px-5 pb-5 ">
                      <Button
                        className="bg-transparent  mr-5 w-32"
                        mode="outlined"
                        labelStyle={{ fontWeight: 'bold' }}
                        textColor="#ffffffbf"
                        onPress={hideDialog}>
                        {t('Modal.btn2')}
                      </Button>
                      <Button
                        className="bg-[#EE2737FF] w-32 "
                        textColor="#000000FF"
                        labelStyle={{ fontWeight: 'bold' }}
                        mode="contained"
                        onPress={download}>
                        {t('Modal.btn1')}
                      </Button>
                    </View>
                  </View>
                </MyModal>
              </Portal>
              <AppNavigator />
              <Toast
                config={toastConfig}
                bottomOffset={200}

              />
            </SafeAreaProvider>
          </PaperProvider>
        </BottomSheetModalProvider>
      </ModalLayers>
    </GestureHandlerRootView>
  );
};

export default App;
