import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackHeaderProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, RefreshControl, ImageBackground, StyleSheet, StyleProp, ViewStyle, TouchableOpacity, ImageSourcePropType, Image, Animated, PanResponder, Dimensions } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { RootStackParamList } from '@router/type';
import BaseLayout from '@components/baselayout';
import { TabScreen, Tabs, TabsProvider } from 'react-native-paper-tabs';
import { useImmer } from 'use-immer';
import CustomFlatList from '@components/custom-flatlist';
import { winePartyByAll } from '@api/fightwine';
import useMode from './hooks/useMode';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { cssInterop } from 'nativewind'
import { useTranslation } from 'react-i18next';
import { BlurView } from '@react-native-community/blur';
import useSelectShop from '@hooks/useSelectShop';
import useUserInfo from '@hooks/useUserInfo';

import { useDebounceFn } from 'ahooks';
import { getGenericPassword } from 'react-native-keychain';

const ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height

cssInterop(Button, {
  className: 'style'
})

cssInterop(Text, {
  className: 'style'
})

const bg1 = require('@assets/imgs/fightwine/bg1.png');
const bg2 = require('@assets/imgs/fightwine/bg2.png');
const bg3 = require('@assets/imgs/fightwine/bg3.png');
const bg4 = require('@assets/imgs/fightwine/bg4.png');

const launch = require('@assets/imgs/base/launch.png');
const maleIcon = require('@assets/imgs/fightwine/maleIcon.png');
const famaleIcon = require('@assets/imgs/fightwine/famaleIcon.png');
type Item = {
  bg: ImageSourcePropType;
  tagColor: string;
  color: string;
  winePartyMode: string;
  modeName?: string
}



//这里业务接口
const list: Item[] = [
  { bg: bg1, tagColor: 'bg-[#1A5CC980]', color: 'text-[#1A5CC9FF]', winePartyMode: 'FEMALE_AA' },
  { bg: bg2, tagColor: 'bg-[#C97B2480]', color: 'text-[#C97B24FF]', winePartyMode: 'AA' },
  { bg: bg3, tagColor: 'bg-[#20C9C380]', color: 'text-[#069E98FF]', winePartyMode: 'PAY_SOLO' },
  { bg: bg4, tagColor: 'bg-[#CA236F80]', color: 'text-[#CA236FFF]', winePartyMode: 'MALE_AA' },
];




const ItemCard = ({ cards, className }: { cards: any[] }) => {

  const positionLeft = (index: number): StyleProp<ViewStyle> => {
    const left = -10 * index;


    return {
      left,
      zIndex: index,
    };

  };

  return (<View className={`flex flex-row  overflow-hidden relative ${className}`}>
    {cards.map((Item, index) => (<View key={index} style={positionLeft(index)} className={'  w-8 h-8 rounded-full relative border border-[#000000] overflow-hidden   '}>
      {Item}
    </View>))
    }
  </View >);
};

//  const generic = await getGenericPassword()

// console.log(generic, 'generic')

// if ((generic as UserCredentials)?.password) {
//   await applicationRun()
// }


export const Item = (props) => {
  const { partyName, statusDesc, peopleNum, modeName, entranceDate, latestArrivalTime, onPress, id, partyMode, maleAvatarList, femaleAvatarList, maleNum, femaleNum, partyModeDesc, isShowStatusDesc = true } = props;
  const maleIconList = createAvatar(maleNum, maleAvatarList ?? [], 'bg-[#E6A055FF]', maleIcon)
  const famaleIconList = createAvatar(femaleNum, femaleAvatarList ?? [], 'bg-[#EE2737FF]', famaleIcon)

  const { t } = useTranslation()

  //寻找对应的元素 需要里面的tagColor,color
  const { tagColor, color, bg } = list.find(item => item.winePartyMode === partyMode)!;

  const tags = [
    { label: partyModeDesc },
    { label: `${peopleNum} ${t('fightwine.tag1')}` },
    { label: `${entranceDate}  ${t('fightwine.tag2')}` },
  ];


  const tagBg = (index: number) => {
    return index === 0 ? tagColor : 'bg-[#FFFFFF26]';
  };




  return <View className="  p-2.5 m-2.5  relative rounded-2xl overflow-hidden">
    <ImageBackground source={bg} className="absolute left-0 right-0 bottom-0 z-0 top-0" />

    <View className="flex flex-row items-center justify-between ">
      <Text className="text-sm text-white font-bold">{partyName}</Text>
      {isShowStatusDesc && <Text className="text-xs text-white border border-white rounded-xl px-1.5 py-1">{statusDesc}</Text>}
    </View>
    <View className="flex-row mt-3.5 flex-wrap ">
      {tags.map((item, index) => (<View className={`py-1.5 px-1.5 my-1.5 mr-1.5 overflow-hidden  rounded-2xl ${tagBg(index)}`} key={index}>
        <Text key={index} >{item.label}</Text>
      </View>))}
    </View>
    <View className="mt-5 flex-row ">
      <ItemCard cards={maleIconList} />
      <ItemCard cards={famaleIconList} className='mr-5' />
      <TouchableOpacity activeOpacity={1} className=" p-2 justify-self-end justify-center items-center bg-[#FFFFFF] rounded-2xl absolute right-0" onPress={() => onPress(id)}>
        <View>
          <Text className={` font-normal ${color}`}  >{t('fightwine.btn2')}</Text>
        </View>
      </TouchableOpacity>

    </View>
  </View>;
};


type HeaderRightProps = {
  onPress: () => void
}

const HeaderRight = (props: HeaderButtonProps & HeaderRightProps) => {

  console.log(props);

  const { t } = useTranslation()

  return (
    <View className="mr-4">
      <Button textColor="white" contentStyle={{ height: 36 }} style={{ height: 36 }} className="bg-[#EE2737FF]" onPress={props.onPress}  >{t('fightwine.btn1')}</Button>
    </View>
  );
};

const FightwineScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { shop } = useSelectShop();
  const flatRef = useRef(null)
  useEffect(() => {
    navigation.setOptions({
      headerRight: (props: HeaderButtonProps) => <HeaderRight {...props} onPress={nextMyWineParty} />,
    });
  }, [navigation]);
  const { modeList } = useMode<Item[]>(undefined, list);
  const [data, setData] = useImmer({
    refreshing: false,
    defaultIndex: 0,
  });
  //发起酒局
  const onLaunch = () => {
    navigation.navigate('Launch');
  };
  const { run } = useDebounceFn(onLaunch, {
    wait: 500
  })





  const toUrl = async (id: string) => {
    const generic = await getGenericPassword()

    // console.log(generic, 'generic')

    if ((generic as UserCredentials)?.password) {
      navigation.navigate('FightwineDetail', { partyId: id });
    } else {
      navigation.navigate('Login');
    }




  };

  const handleChangeIndex = (index: number) => {
    setData((darft) => {
      darft.defaultIndex = index;
    });

  };

  /* 跳转我的酒局 */
  function nextMyWineParty() {
    navigation.navigate('MyWineParty');
  }

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        //当大于5时才进入移动事件，有的情况下需要将onStartShouldSetPanResponderCapture设为false
        if (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) {
          return true;
        } else if (
          Math.abs(gestureState.dx) <= 5 ||
          Math.abs(gestureState.dy) <= 5
        ) {
          return false;
        }

        return true
      },
      onPanResponderGrant: () => {
        // pan.setOffset({
        //   x: pan.x._value,
        //   y: pan.y._value
        // });
      },
      onPanResponderMove: (evt, gestureState) => {

        const { dx, dy, moveX, moveY } = gestureState;
        if (moveX < 20 || moveX > ScreenWidth - 10 || moveY < 150 || moveY > ScreenHeight - 70) {
          return
        }


        console.log(moveX, moveY, ScreenWidth)
        return Animated.event([null, {
          dx: pan.x,
          dy: pan.y,
        }])(evt, gestureState)
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.extractOffset();
      }
    })
  ).current;

  const getId = useCallback((item: any) => item.id, []);

  return (
    <BaseLayout>
      {/* <CheckLayout /> */}
      <TabsProvider
        defaultIndex={0}
        onChangeIndex={handleChangeIndex}
      >
        {modeList.length > 0 && <Tabs
          uppercase={true} // true/false | default=true (on material v2) | labels are uppercase
          // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
          // iconPosition // leading, top | default=leading
          style={{ backgroundColor: 'transparent' }} // works the same as AppBar in react-native-paper
          dark={true} // works the same as AppBar in react-native-paper
          // theme={} // works the same as AppBar in react-native-paper
          mode="scrollable" // fixed, scrollable | default=fixed
          showLeadingSpace={false} //  (default=true) show leading space in scrollable tabs inside the header
          disableSwipe={true} // (default=false) disable swipe to left/right gestures
        >

          {modeList.map((m, index) => (<TabScreen key={m.winePartyMode} label={m.modeName!}>
            {m && (<View className="bg-transparent">
              {index === data.defaultIndex && <CustomFlatList ref={flatRef} params={{ winePartyMode: m.winePartyMode, storeId: shop.select.id }} keyExtractor={getId} renderItem={(item) => <Item key={item.id} {...item} modeName={m.modeName} onPress={toUrl} isShowStatusDesc={false} />} onFetchData={winePartyByAll} />}
            </View>)}
          </TabScreen>))}
        </Tabs>}

      </TabsProvider>
      <Animated.View
        className="absolute z-50  bottom-1/4 right-0"
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }]
        }}
        {...panResponder.panHandlers}

      >
        <TouchableOpacity onPress={run} >
          <ImageBackground source={launch} className="w-16 h-16" />
        </TouchableOpacity>
      </Animated.View>
      {/* <TouchableOpacity className="absolute z-50 w-16 h-16 bottom-1/4 right-0" onPress={onLaunch}>
        <ImageBackground source={launch} className="w-16 h-16" />
      </TouchableOpacity> */}


    </BaseLayout>
  );
};


function createAvatar(people: number, avatarList: any[], bg: string = 'bg-[#E6A055FF]', icon: any = maleIcon) {

  const avatarListRender_ = Array.from({ length: people - avatarList.length }, () => {
    return <View className={`${bg} w-8 h-8 items-center justify-center`}>
      <Image source={icon} className='w-6 h-6' />
    </View >
  })

  const avatarListRender = avatarList.map((m: string) => {
    // return <ImageBackground source={{ uri: m }} className='w-6 h-6' />
    return (<View className='relative w-8 h-8  overflow-hidden'>
      <BlurView
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, zIndex: 10 }}
        blurAmount={1}
        blurType="light"
        reducedTransparencyFallbackColor="transparent"

      />
      <ImageBackground source={{ uri: m }} className='w-8 h-8' />
    </View>)
  })
  const iconList = [...avatarListRender, ...avatarListRender_]

  return iconList

}


export default FightwineScreen;
