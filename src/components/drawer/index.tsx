import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetBackgroundProps, BottomSheetModal, BottomSheetProps, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { FC, useCallback, useMemo, useRef, forwardRef } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
const headerIcon = require('@assets/imgs/base/header.png');


const CustomBackground: FC<BottomSheetBackgroundProps> = (props) => {
  const style = props.style
  const animatedIndex = props.animatedIndex
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ['#a8b5eb', '#a8b5eb']
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  // render
  return <View className="border" />;
};


const ListHeaderComponent: FC<{ headerText?: string }> = ({ headerText = '标 题' }) => {
  return <View className="relative h-20 w-full">
    <FastImage
      className="absolute h-full w-full inset-0 -z-10"
      source={headerIcon}
      resizeMode={FastImage.resizeMode.cover}
    />
    <View className="h-full flex items-center">
      <View className="rounded w-10 h-1  mt-2 bg-[#0B0B0B]" />
      <View className="h-12 justify-center">
        <Text className="text-lg font-bold " style={{ color: '#fff' }} >{headerText}</Text>
      </View >
    </View >
  </View >;
};


const Drawer = forwardRef<BottomSheetModalMethods, BottomSheetProps>(({ children, snapPoints = ['95%'], ...props }, ref) => {

  const snapPointsMemo = useMemo(() => snapPoints, [snapPoints]);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        animatedIndex={{
          value: 1,
        }}
      />
    ),
    []
  );
  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={props.onDismiss}
      enableDynamicSizing={false}
      enablePanDownToClose
      snapPoints={snapPointsMemo}
      keyboardBlurBehavior="restore"
      enableContentPanningGesture={false}
      backdropComponent={renderBackdrop}
      handleComponent={null}
      backgroundStyle={{
        backgroundColor: '#0B0B0BFF',
      }}
      style={{ borderRadius: 20, overflow: 'hidden' }}
      onChange={handleSheetChanges}   {...props}>
      {children}
    </BottomSheetModal>
  );
});


export default Drawer;
