import BaseLayout from '@components/baselayout';
import { useRef, useState } from 'react';
import { View, Image, Pressable, TouchableWithoutFeedback, NativeSyntheticEvent, TextInputFocusEventData, ImageSourcePropType, ImageBackground, ScrollView } from 'react-native';
import { IconButton, Button, Text, TextInput, TouchableRipple, Dialog, Divider } from 'react-native-paper';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs';
import { useImmer } from 'use-immer';
import { Keyboard } from 'react-native';
import { updateFile } from '@api/common';
import Toast from 'react-native-toast-message';
import { editUserInfoApi } from '@api/login';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@router/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRequest } from 'ahooks';
import { detailsById } from '@api/user';
import { cssInterop } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { BlurView } from '@react-native-community/blur';

const bgImage = require('@assets/imgs/login/login-register-bg.png');

cssInterop(IconButton, {
  className: {
    target: 'style'
  }
})

const UserInfo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  //选择头像
  const [selectImage, setSelectImage] = useState<Asset>({ uri: '' });
  //选择日期
  const [dateTimer, setdateTimer] = useImmer({
    date: new Date(),
    show: false,
  });
  const formatDay = dayjs(dateTimer.date).format('YYYY-MM-DD');
  const [nickname, setNickname] = useState('');
  const [personalSignature, setPersonalSignature] = useState('');
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation()

  const id = useRef('');

  useRequest(detailsById, {
    onSuccess: (res) => {
      console.log(res, 'res');
      const _data = res.data;
      if (res.success) {
        console.log(_data.avatarUrl);

        setSelectImage({ uri: _data.avatarUrl });
        setNickname(_data.nickname);
        setdateTimer(draft => {
          draft.date = _data.birthday ? dayjs(_data.birthday).toDate() : new Date();
        });
        setPersonalSignature(_data.personalSignature);
        id.current = _data.avatarFileId;
      }

    },
  });


  const onChange = (selectDate?: Date) => {
    const currentDate = selectDate || dateTimer.date;
    setdateTimer(draft => {
      draft.date = currentDate;
      draft.show = false;
    });
  };

  async function handleNext() {
    if (!selectImage.uri) {
      Toast.show({
        text1: '请上传头像',
      });
      return;
    }

    if (!nickname) {
      Toast.show({
        text1: '请填写昵称',
      });
      return;
    }

    try {

      if (selected) {
        const data = await uploadImage(selectImage);
        console.log(data, '这是data哦');
        if (data.success) {
          id.current = data.data.id;

        }

      }
      const { data: userInfo } = await editUserInfoApi({ avatarFileId: id.current, nickname, birthday: formatDay, personalSignature });


      if (userInfo.success) {
        //修改用户信息成功
        navigation.navigate('HomeTabs');
      }

    } catch (error) {
      console.log(error);
    }
  }

  //选择头像
  async function handleChooseImage() {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 600,// 设置选择照片的大小，设置小的话会相应的进行压缩
      maxHeight: 600,
      quality: 0.8,
      selectionLimit: 1,

    });

    if (response.didCancel) {
      console.log('User cancelled image picker');

    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);

    } else {
      if (response.assets) {
        console.log(response.assets[0]);
        setSelectImage(response.assets[0]);
        setSelected(true);
      }

      // You can now use the chosen image as an avatar
    }


  }

  function onFocus() {
    Keyboard.dismiss();
    setdateTimer((draft) => { draft.show = true; });
  }

  // 上传图片api调用
  async function uploadImage(params: Asset) {
    console.log(params.uri);

    const formData = new FormData();
    formData.append('file', {
      uri: params.uri,
      type: params.type,
      name: params.fileName,
    });

    console.log(formData);

    return await updateFile(formData);
  }



  const imgRender = (<IconButton
    icon="plus-thick"
    iconColor={'#ffffff'}
    size={24}
    className="w-24 h-24 rounded-full bg-[#191919]  border-[#343434]"

  />);

  const btnRender = (<Image source={selectImage} className="rounded-full" style={{ width: 100, height: 100 }} />);




  return (
    <BaseLayout source={false} showAppBar={false} className='bg-[#222222FF]'>
      {/* header-img */}
      <View className=' overflow-hidden  h-96 z-10  relative top-0 w-full flex-row  justify-center items-center '>
        <BlurView
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="transparent"
        />
        {selectImage?.uri && <Image resizeMode="cover" source={selectImage} className='w-full h-full absolute -z-10' />}

        <View className='w-full  flex-col items-center '>
          <Pressable onPress={handleChooseImage}>
            {selectImage?.uri ? btnRender : imgRender}
          </Pressable>
          <Text className='mt-4 text-center w-40' numberOfLines={2}>{nickname}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}
        className='relative  -top-4 right-0 left-0 overflow-hidden z-40  rounded-t-2xl bg-[#222222FF]'
      >
        <ScrollView>
          <View className='p-5'>
            <View className='mb-8'>
              <Text>{t('wineDetail.title1')}</Text>
              <View className='bg-[#191919]  rounded-xl p-5 border border-[#343434FF] mt-2.5'>
                <View className=' flex-row items-center mb-5 '>
                  <Text className='text-[#fff] mr-10'>{t('userInfo.tag2')}</Text>
                  <TextInput className="bg-transparent flex-1"
                    value={nickname}
                    underlineColor="transparent"
                    onChangeText={(text) => setNickname(text)}
                    contentStyle={{ height: 30 }}
                    style={{ height: 30, opacity: 50 }}
                  />
                </View>
                <Divider />
                <View className=' flex-row items-center mt-5 h-[30]'>
                  <Text className=' mr-10 text-[#fff]'>{t('userInfo.tag3')}</Text>
                  <DatePicker date={dateTimer.date} modal={true} theme='dark' open={dateTimer.show} mode='date'
                    maximumDate={new Date()}
                    onCancel={() => setdateTimer((d) => {
                      return { show: false, date: d.date }
                    })} onConfirm={onChange} />
                  <Pressable onPress={onFocus} className='flex-1'>
                    <Text className='text-right  opacity-50'>{formatDay}</Text>
                  </Pressable>

                </View>
              </View>
            </View>

            <View>
              <Text>{t('user.header1')}</Text>
              <View className='mt-2.5 rounded-xl border-[#343434FF] bg-[#191919] overflow-hidden'>
                <TextInput
                  multiline numberOfLines={8}

                  className="bg-[#191919FF] border-none" mode='flat' underlineColor="transparent" activeOutlineColor='transparent'
                  value={personalSignature} onChangeText={(t) => setPersonalSignature(t)}
                />
              </View>
            </View>

            <Button
              mode="outlined"
              className='mt-10'
              style={{
                borderColor: '#EE2737FF',
                borderRadius: 33,
                backgroundColor: "#EE2737FF"
              }}
              labelStyle={{ fontSize: 18, color: '#0C0C0CFF', fontWeight: '600' }}
              contentStyle={{ height: 50 }}
              onPress={handleNext}
            >
              {t('userInfo.btn1')}
            </Button>


          </View>
          {/* <View className="mt-10">

          <TextInput className="bg-transparent" value={nickname} onChangeText={(text) => setNickname(text)} />
        </View>
        <View className="mt-10">

          {dateTimer.show && <DateTimePicker onChange={onChange} value={dateTimer.date} />}
          <TextInput className="bg-transparent" showSoftInputOnFocus={false} value={formatDay} onFocus={onFocus} />
        </View>

        <View className="mt-10">
          <TextInput className="bg-transparent" value={personalSignature} onChangeText={(t) => setPersonalSignature(t)} />
        </View>
        <View className="h-32 mt-auto  justify-start">
          <Button
            mode="outlined"
            style={{
              borderColor: '#EE2737FF',
              borderRadius: 33,
              backgroundColor: "#EE2737FF"
            }}
            labelStyle={{ fontSize: 18, color: '#0C0C0CFF', fontWeight: '600' }}
            contentStyle={{ height: 50 }}
            onPress={handleNext}
          >
            {t('userInfo.tag5')}
          </Button>
        </View> */}
        </ScrollView>
      </View>
    </BaseLayout >);

};


export default UserInfo;
