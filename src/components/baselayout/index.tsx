import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, Keyboard, SafeAreaView, View, type ImageSourcePropType } from 'react-native';
import { StatusBar, NativeModules, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Loading from './loading';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
const defaultBg = require('@assets/imgs/base/default-bg.png');




type IProps = {
  source?: ImageSourcePropType | boolean,
  className?: string
  showAppBar?: boolean
  showNoMore?: boolean,
  loading?: boolean,
};

const RendernoMoreData = () => {
  const { t } = useTranslation();
  return <Text className="text-center">{t('flatList.noMore1')}</Text>;
};

const BaseLayout: FC<PropsWithChildren<IProps>> = ({ source = defaultBg, className = '', children, showAppBar = true, showNoMore = false, loading = false }) => {

  const [statusBarHeight, setStatusBarHeight] = useState<number>(StatusBar.currentHeight!)



  if (Platform.OS === 'ios') {
    const { StatusBarManager } = NativeModules;
    StatusBarManager.getHeight(statusBarHeight => {
      const height = statusBarHeight.height
      setStatusBarHeight(height)

    });
  }


  function handleUnhandledTouches() {
    Keyboard.dismiss()
    return false;
  }

  const classNames = `flex-1 bg-[#101010FF] ${className}`;
  return (

    <View className={classNames} onStartShouldSetResponder={handleUnhandledTouches}>
      {loading && <Loading />}
      {source && <ImageBackground source={source} resizeMode="cover" className="absolute left-0 right-0 bottom-0 -z-10 top-0" />}

      {/* {showNoMore ? <RendernoMoreData /> : children} */}
      {showNoMore ? <RendernoMoreData /> : <SafeAreaView style={{ flex: 1 }}>
      {showAppBar && <View style={{ paddingTop: statusBarHeight }} />}
      {children}
        </SafeAreaView>}
      {/* {showNoMore ? <RendernoMoreData /> : children} */}
    </View >

  );
};

export default BaseLayout;
