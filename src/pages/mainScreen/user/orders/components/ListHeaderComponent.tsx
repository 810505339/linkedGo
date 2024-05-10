import BaseLayout from '@components/baselayout';
import { FC, useEffect, memo } from 'react';
import { View, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { useImmer } from 'use-immer';


type IProps = {
  list: Array<string>,
  tabIndex: number
  className: string,
  itemClick: (index: number) => void
}

const ListHeaderComponent: FC<IProps> = ({ list, tabIndex, className, itemClick }) => {
  console.log('render');

  const [data, setData] = useImmer({
    // list: [{ title: '全部', x: 0, w: 0, h: 0 }, { title: '已支付', x: 0, w: 0, h: 0 }, { title: '未支付', x: 0, w: 0, h: 0 }],
    boxList: Array.from({ length: list.length }, () => ({ x: 0, w: 0, h: 0 })),
    tabIndex: tabIndex,
  });

  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const postionX = useSharedValue(0);
  const scale = useSharedValue(1);
  const handlePress = (index: number) => {
    const current = data.boxList[index];
    scale.value = withSequence(
      withSpring(0, { duration: 1000 / 8 }),
      withSpring(1, { duration: 1000 / 8 })
    );
    width.value = withSpring(current.w);
    height.value = withSpring(current.h);
    postionX.value = withSpring(current.x);
    itemClick(index)

    runOnJS(setData)((draft) => { draft.tabIndex = index; });

  };

  const style = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    transform: [{ translateX: postionX.value }, { scale: scale.value }],
  }));

  const handleTextLayout = (event: LayoutChangeEvent, index: number) => {


    const { width, height, x } = event.nativeEvent.layout;
    setData(draft => {
      draft.boxList[index].x = x;
      draft.boxList[index].w = width;
      draft.boxList[index].h = height;
    });
  };

  useEffect(() => {
    if (data.boxList[tabIndex].w != 0) {


      const current = data.boxList[tabIndex];
      console.log(current);

      width.value = current.w;
      height.value = current.h;
      postionX.value = current.x;
    }

  }, [data.boxList[tabIndex]]);



  return <View className={`h-12 bg-[#ffffff19] ${className}`}>
    <View className="flex-row items-center  justify-around relative h-12">
      {list.map((item, index) => <TouchableOpacity key={index} onLayout={(e) => handleTextLayout(e, index)} className=" py-2 px-4 mx-2" onPress={() => handlePress(index)} >
        <Text className={`${data.tabIndex === index ? 'text-[#ffffff]' : 'text-[#ffffffbf]'}`}  >
          {item}

        </Text>
      </TouchableOpacity>)}
      <Animated.View className="left-0 bg-red-500 absolute -z-10 rounded-2xl" style={style} />

    </View>
  </View >;
};





export default memo(ListHeaderComponent);
