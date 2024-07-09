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
import SplashScreen from 'react-native-splash-screen'
import { useNetInfo } from '@react-native-community/netinfo';
import Loading from '@components/baselayout/loading';



const App = () => {

  const { isConnected } = useNetInfo();
  const { t } = useTranslation()
  useUserInfo();
  useImLogin();
  useSysLanguage();
  useBackHandler(() => {
    return ModalLayerFactory.back();
  });
  useEffect(() => {
    getFileUrl();
  }, [isConnected])

  useEffect(() => {
    /* 这是启动页 */
    SplashScreen.hide();

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
