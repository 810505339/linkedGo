import BaseLayout from '@components/baselayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, ImageBackground, Pressable, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Divider, List } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { RootStackParamList } from '@router/type';
import CheckAuthLayout from '@components/baselayout/checkLayout';
import { BlurView } from '@react-native-community/blur';
import { useRequest } from 'ahooks';
import { detailsById, mineInfo } from '@api/user';
import CustomModal from '@components/custom-modal';
import useLanguageSelect from './hooks/useLanguageSelect';
import { useImmer } from 'use-immer';
import { cssInterop } from 'nativewind'
import { useTranslation } from 'react-i18next';
import { useAsyncEffect } from 'ahooks'
import { getGenericPassword } from 'react-native-keychain';


cssInterop(Appbar.Header, {
  className: 'style'
})
const headerWrapIcon = require('@assets/imgs/base/header.png')
const bg1Icon = require('@assets/imgs/user/bg_1.png');
const bg2Icon = require('@assets/imgs/user/bg_2.png');
const bg3Icon = require('@assets/imgs/user/bg_3.png');
const manIcon = require('@assets/imgs/user/man.png');
const womanIcon = require('@assets/imgs/user/woman.png');
const certifiedIcon = require('@assets/imgs/user/certified.png');
const noCertifiedIcon = require('@assets/imgs/user/noCertified.png');
const logoIcon = require('@assets/imgs/base/logo.png');
const editIcon = require('@assets/imgs/user/edit.png');
const languageIcon = require('@assets/imgs/user/language.png');

/* xitong  */
const xitong = require('@assets/imgs/user/xitong.png');
const huodong = require('@assets/imgs/user/huodong.png');
const zhanghao = require('@assets/imgs/user/zhanghao.png');
const mendian = require('@assets/imgs/user/mendian.png');
const fuwu = require('@assets/imgs/user/fuwu.png');
const lianxi = require('@assets/imgs/user/lianxi.png');
const manHeaderIcon = require('@assets/imgs/user/header.png');
const womanHeaderIcon = require('@assets/imgs/user/header1.png');







type IListHeader = {
  balancePress: (name: string) => void
  navigation: NativeStackNavigationProp<UsertackParamList>
  t: any
}



const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation()

  const { data: _userInfo, runAsync } = useRequest(detailsById, {
    manual: true,
  });
  const { data, runAsync: userRun } = useRequest(mineInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log('跟新', res)
    }
  });

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header navigation={navigation} />,
    });

  }, [navigation]);

  /* 用户信息 */
  const userInfo = _userInfo?.data;
  const info = data?.data;

  const cells = useMemo(() => {
    return ([
      { id: 'SystemMessage', title: t('user.item1'), left: xitong, right: '' },
      { id: 'MyActive', title: t('user.item2'), left: huodong, right: '' },
      { id: 'Account', title: t('user.item3'), left: zhanghao, right: '' },
      { id: 'Store', title: t('user.item4'), left: mendian, right: '' },
      { id: 'Agreement', title: t('user.item5'), left: fuwu, right: '' },
      { id: 'Customer', title: t('user.item6'), left: lianxi, right: '' },

    ]);
  }, [t]);





  const balancePress = (name: string) => {
    navigation.navigate(name);
  };

  const handleItemPress = (item) => {
    navigation.navigate(item.id);

  };

  const Right = (props: any) => {


    const { id } = props
    return (<View className='flex-row  items-center'>
      {id === 'SystemMessage' && userInfo?.unReadMsgNum > 0 && <View className='w-2 h-2 rounded-full bg-[#F56C6CFF] border border-red-500' />}
      <List.Icon icon="chevron-right" />
    </View>)
  }

  const ListHeader = ({ balancePress, navigation, t }: IListHeader) => {

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
        const generic = await getGenericPassword();
        console.log('generic', generic);
        if (generic) {
          await Promise.all([runAsync(), userRun()])


        }
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }, [navigation])


    const fontText = 'text-xs text-[#ffffff7f] text-center';
    const box = 'items-center h-40  justify-end  relative';

    const sexIcon = userInfo?.gender === 1 ? manIcon : womanIcon;
    const sexHeaderIcon = userInfo?.gender === 1 ? manHeaderIcon : womanHeaderIcon;
    const isCertifiedIcon = userInfo?.checkFace ? certifiedIcon : noCertifiedIcon;
    const sexText = userInfo?.gender === 1 ? t('user.header4') : t('user.header5');
    const isCertifieText = userInfo?.checkFace ? t('user.header2') : t('user.header3');

    const orderCount = info?.orderCount >= 100 ? `99+` : info?.orderCount


    const avatarUrl = userInfo?.avatarUrl ? (<Image className={' w-24  h-24 rounded-full border-2 border-[#98000CFF]'} resizeMode="cover" source={{ uri: userInfo?.avatarUrl }} />) :
      (<Image className={' w-24  h-24 rounded-full border-2 border-[#98000CFF]'} resizeMode="cover" source={sexHeaderIcon} />)


    const header = (
      <View className=" ml-5   flex-auto" >
        <View><Text className="text-xl text-[#fff] font-bold">{userInfo?.nickname}</Text></View>
        <View >
          <Text numberOfLines={2} ellipsizeMode="tail" className="text-white opacity-50">{userInfo?.personalSignature ?? t('user.header1')}</Text>
        </View>
        <View className="flex-row mt-4">
          <View className="h-6 rounded-xl  mr-2 items-end justify-center overflow-hidden">
            <BlurView
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}
              blurType="light"
              blurAmount={5}
              reducedTransparencyFallbackColor="transparent"

            />
            <Image source={isCertifiedIcon} className="w-4 h-4 absolute left-2" />
            <Text className=" text-xs pl-8 pr-2 text-white opacity-50" >{isCertifieText}</Text>
          </View>

          {userInfo?.checkFace && <View className=" h-6 rounded-xl items-end justify-center overflow-hidden">
            <BlurView
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="transparent"
            />
            <Image source={sexIcon} className="w-4 h-4 absolute left-2" />
            <Text className="text-xs pl-8 pr-2 text-white opacity-50" numberOfLines={2}>{sexText}</Text>
          </View>}



        </View>
      </View>)

    return <View className=" rounded-t-3xl bg-[#0B0B0BFF]">
      <ImageBackground source={headerWrapIcon} className=' h-[80px] ' resizeMode='cover' />
      {/* 头像 */}
      <View className=" px-5 flex   flex-row  box-border relative -top-10">
        <View className="w-24 h-24   rounded-full">
          {avatarUrl}
        </View>
        {userInfo ? header :
          (<TouchableOpacity className=' flex-auto  ml-5 justify-center'><Text className='text-[18px] font-bold text-white' onPress={() => navigation.navigate('Login')}>{t('user.item7')}</Text></TouchableOpacity>)
        }
      </View>
      {/* 头像下面的三个信息 */}
      <View className="flex flex-row   border-[#ffffff7f]   gap-x-2.5  w-[90vw] ml-4 mb-5 ">
        <TouchableOpacity className={`${box} basis-2/4`} onPress={() => balancePress('Information')} >
          <ImageBackground source={bg1Icon} resizeMode='contain' className="absolute right-0 bottom-0 left-0 w-full h-full" />
          <View className='pb-8'>
            <View className='flex-row items-center justify-center'>
              <Text className='text-sm text-[#E6A055FF]'>S$</Text>
              <Text className="text-[#E6A055FF]  text-[24px]  text-center font-bold">
                {info?.balanceAmount ?? 0}
              </Text>
            </View>
            <Text className={fontText}>{t('user.tag1')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className={`${box} basis-1/4 `} onPress={() => balancePress('Coupons')} >
          <ImageBackground source={bg2Icon} resizeMode='contain' className="absolute inset-0 w-full h-full" />
          <View className='pb-8'>
            <Text className="text-[#FF4DCEFF]  text-[24px] text-center  font-bold">{info?.couponCount ?? 0}</Text>
            <Text className={fontText}>{t('user.tag2')}</Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity className={`${box}  basis-1/4 `} onPress={() => balancePress('Orders')}>
          <ImageBackground source={bg3Icon} resizeMode='contain' className="absolute inset-0 w-full h-full" />
          <View className='pb-8'>
            <Text className="text-[#2ECFFFFF] text-[24px] text-center font-bold">{orderCount ?? 0}</Text>
            <Text className={fontText}>{t('user.tag3')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View >;
  };

  const renderItem = ({ item }) => {
    return (<List.Item title={item.title} className='flex-row items-center pl-5 bg-[#0B0B0BFF] opacity-75' left={() => <List.Icon icon={item.left} />} right={() => <Right {...item} />} onPress={() => handleItemPress(item)} />);
  };

  return (<BaseLayout className="bg-[#0B0B0BFF]">
    <Animated.View className={' bg-[#0B0B0BFF] pb-24'}>
      <Animated.FlatList
        ListHeaderComponent={() => <ListHeader balancePress={balancePress} t={t} navigation={navigation} />}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        data={cells}
      />
    </Animated.View>
  </BaseLayout>);
};



const Header = ({ navigation }) => {
  const { bottomSheetModalRef, languageList, showLanguage, selectLanguage, selectValue } = useLanguageSelect();
  const { t } = useTranslation();
  function toUserInfo() {
    navigation.navigate('EditUserInfo');
  }

  return ((<Appbar.Header style={{ backgroundColor: 'transparent' }} className="flex-row items-center justify-between px-4  pb-4">
    <Image source={logoIcon} />
    <View className="flex-row items-center gap-x-4">
      <Pressable onPress={toUserInfo}>
        <Image source={editIcon} />
      </Pressable>
      <Pressable onPress={showLanguage}>
        <Image source={languageIcon} />
      </Pressable>
    </View>

    <CustomModal ref={bottomSheetModalRef} data={languageList} selectValue={selectValue} headerText={t('user.header6')} onPress={selectLanguage} snapPoints={['50%']} />
  </Appbar.Header>));
};






export default HomeScreen;
