import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Dimensions, LogBox, TouchableOpacity, useWindowDimensions, View, ImageBackground } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { RootStackParamList } from '@router/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';
import { BlurView } from '@react-native-community/blur';


const PAGE_WIDTH = Dimensions.get('window').width;

export interface ISButtonProps {
  visible?: boolean
  onPress?: () => void
}

export interface IProps {
  swiperList: {
    pictureFile: any[]
  }[]
}



function Index({ swiperList }: IProps) {
  const windowWidth = useWindowDimensions().width;
  const scrollOffsetValue = useSharedValue<number>(0);

  const baseOptions = ({
    vertical: false,
    width: windowWidth - 32,

  } as const)

  const pressAnim = useSharedValue<number>(0);
  const progressValue = useSharedValue<number>(0);


  const animationStyle = React.useCallback(
    (value: number) => {
      'worklet';

      const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, 1000]);
      const translateX = interpolate(
        value,
        [-1, 0, 1],
        [-PAGE_WIDTH, 0, PAGE_WIDTH],
      );

      return {
        transform: [{ translateX }],
        zIndex,
      };
    },
    [],
  );

  React.useEffect(() => {
    console.log(pressAnim.value);

  }, [pressAnim.value]);

  return (
    // <View className="flex-auto p-5  relative">
    //   <Carousel
    //     loop={true}
    //     autoPlay={true}
    //     pagingEnabled={true}

    //     className="h-full"
    //     style={{ width: PAGE_WIDTH - 40 }}
    //     width={PAGE_WIDTH - 40}
    //     data={[...ImageItems]}
    //     //并且当数据长度小于 3 时，您还需要添加 prop
    //     // autoFillData={false}
    //     // onSnapToItem={(index) => console.log('current index:', index)}
    //     onScrollBegin={() => {
    //       pressAnim.value = withTiming(1);
    //     }}
    //     onScrollEnd={() => {
    //       pressAnim.value = withTiming(0);
    //     }}
    //     onProgressChange={(offsetProgress, absoluteProgress) => {
    //       progressValue.value = absoluteProgress;
    //     }}
    //     renderItem={({ index, item }) => {
    //       return (
    //         <CustomItem
    //           source={item}
    //           key={index}
    //           pressAnim={pressAnim}
    //         />
    //       );
    //     }}
    //     customAnimation={animationStyle}
    //     scrollAnimationDuration={3000}

    //   />

    //   <View className="flex-row absolute bottom-10 left-0 right-0 justify-center items-center">
    //     {ImageItems.map((item, index) => (
    //       <PaginationItem animValue={progressValue} length={ImageItems.length}
    //         index={index}
    //         key={index} />
    //     ))}
    //   </View>
    // </View>
    <View className=" p-5 relative border" style={{ flex: 1 }}>
      <Carousel
        {...baseOptions}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        loop
        enabled // Default is true, just for demo
        defaultScrollOffsetValue={scrollOffsetValue}
        testID={"xxx"}
        style={{ width: "100%" }}
        autoPlay={true}
        autoPlayInterval={3000}
        data={[...swiperList]}
        onProgressChange={(offsetProgress, absoluteProgress) => {
          progressValue.value = absoluteProgress;
        }}

        onConfigurePanGesture={g => g.enabled(false)}
        pagingEnabled={true}

        renderItem={({ index, item }) => {
          return (
            <CustomItem
              source={item?.pictureFile}
              key={index}
              pressAnim={pressAnim}
              item={item}
            />
          );
        }}
      />

      <View className="flex-row justify-center items-center">
        {swiperList.map((item, index) => (
          <PaginationItem animValue={progressValue} length={swiperList.length}
            index={index}
            key={index} />
        ))}
      </View>

    </View>
  );
}

interface ItemProps {
  pressAnim: Animated.SharedValue<number>
  source: string,
  item: any
}

const CustomItem: React.FC<ItemProps> = (props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  console.log(props, 'props');


  function handleClick() {
    console.log(props.item);

    if (props.item.jump != '0') {
      navigation.navigate('DynamicInfo', {
        id: props.item.dynamicStateId,
      })
    }


  }

  const source = props.source
  const pressAnim = props.pressAnim;
  // const animStyle = useAnimatedStyle(() => {
  //   const scale = interpolate(pressAnim.value, [0, 1], [1, 0.9]);


  //   return {
  //     transform: [{ scale }],

  //   };
  // }, []);

  return (
    <View className={'  rounded-3xl  flex-1 overflow-hidden'} >
      <TouchableOpacity onPress={handleClick} className='relative  flex-1  '>
        {props?.item?.dynamicStateTitle && <View className=' absolute left-0 right-0 overflow-hidden  z-20  bottom-0'>
          <BlurView
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}
            blurType="dark"
            blurAmount={1}
            reducedTransparencyFallbackColor="transparent"

          />
          <Text className='text-[20px] p-4 py-10 text-white z-20 '>
            {props?.item?.dynamicStateTitle}
          </Text>
        </View>
        }
        <ImageBackground source={{ uri: source }} className='flex-1' />
      </TouchableOpacity>

    </View>
  );
};


const PaginationItem: React.FC<{
  index: number
  length: number
  animValue: Animated.SharedValue<number>
  isRotate?: boolean
}> = (props) => {
  const { animValue, index, length, isRotate } = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }
    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      className="w-2.5 h-2.5 rounded-xl overflow-hidden bg-[#ffffff19] mx-1"
      style={{
        transform: [
          {
            rotateZ: isRotate ? '90deg' : '0deg',
          },
        ],
      }}
    >
      <Animated.View
        className={'w-2.5 h-2.5 bg-white  rounded'}
        style={[
          animStyle,
        ]}
      />
    </View>
  );
};

export default Index;
