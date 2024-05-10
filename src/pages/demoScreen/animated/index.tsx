import BaseLayout from '@components/baselayout';
import { FC, useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle, TouchableOpacity, GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Animated, { AnimatedStyle, runOnJS, useAnimatedProps, useAnimatedRef, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useImmer } from 'use-immer';



const AnimatedScreen = () => {
  const [data, setData] = useImmer({
    list: [{ title: '全部', x: 0, w: 0, h: 0 }, { title: '已支付', x: 0, w: 0, h: 0 }, { title: '未支付', x: 0, w: 0, h: 0 }],
    tabIndex: 0,
  });

  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const postionX = useSharedValue(0);
  const scale = useSharedValue(1);
  const handlePress = (index: number) => {
    const current = data.list[index];
    scale.value = withSequence(
      withSpring(0, { duration: 1000 / 8 }),
      withSpring(1, { duration: 1000 / 8 })
    );
    width.value = withSpring(current.w);
    height.value = withSpring(current.h);
    postionX.value = withSpring(current.x);

    runOnJS(setData)((draft) => { draft.tabIndex = index; });

  };

  const style = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    transform: [{ translateX: postionX.value }, { scale: scale.value }],
  }));

  const handleTextLayout = (event: LayoutChangeEvent, index: number) => {
    console.log(1);

    const { width, height, x } = event.nativeEvent.layout;
    setData(draft => {
      draft.list[index].x = x;
      draft.list[index].w = width;
      draft.list[index].h = height;
    });
  };

  useEffect(() => {
    if (data.list[0].w != 0) {


      const current = data.list[0];
      console.log(current);

      width.value = current.w;
      height.value = current.h;
      postionX.value = current.x;
    }

  }, [data.list[0]]);

  return <BaseLayout>
    <View className="flex-row items-center  justify-around relative">
      {data.list.map((item, index) => <TouchableOpacity key={index} onLayout={(e) => handleTextLayout(e, index)} className=" py-2 px-4 mx-2" onPress={() => handlePress(index)} >
        <Text >{item.title}</Text>
      </TouchableOpacity>)}
      <Animated.View className="bottom-0 left-0 bg-red-500 absolute -z-10 rounded-2xl" style={style} />
    </View>
    <Text>{data.tabIndex}</Text>
  </BaseLayout>;
};





export default AnimatedScreen;
