import BaseLayout from '@components/baselayout';
import { useEffect, useRef, useState } from 'react';
import { View, Image, Pressable, TouchableWithoutFeedback, NativeSyntheticEvent, TextInputFocusEventData, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { IconButton, Button, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

const bgImage = require('@assets/imgs/login/login-register-bg.png');
const red = require('@assets/imgs/nav/red.png')
cssInterop(IconButton, {
  className: {
    target: 'style'
  }
})

const UserInfo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleClose = () => {
    navigation.reset({
      index: 0,
      routes: [
        { name: 'HomeTabs' },
      ],
    });
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TouchableOpacity onPress={handleClose} className='ml-5'><Image source={red} className='w-6 h-6 mr-4' /></TouchableOpacity>
    })
  }, [navigation])





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


  const onChange = (event: DateTimePickerEvent, selectDate?: Date) => {
    const currentDate = selectDate || dateTimer.date;
    console.log(event.type);

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

  const btnRender = (<Image source={selectImage} className="h-24 w-24  rounded-full" />);




  return (
    <BaseLayout source={bgImage} >
      <View className="mt-10 mx-5  flex-1"  >
        <View>
          <Text className="mb-2">{t('userInfo.tag1')}</Text>
          <Pressable onPress={handleChooseImage} >
            {selectImage?.uri ? btnRender : imgRender}
          </Pressable>
        </View>
        <View className="mt-10">
          <Text className="mb-2">{t('userInfo.tag2')}</Text>
          <TextInput className="bg-transparent" value={nickname} onChangeText={(text) => setNickname(text)} />
        </View>
        <View className="mt-10">
          <Text className="mb-2">{t('userInfo.tag3')}</Text>
          {dateTimer.show && <DateTimePicker onChange={onChange} value={dateTimer.date} />}

          <TextInput className="bg-transparent" showSoftInputOnFocus={false} value={formatDay} onFocus={onFocus} />

        </View>

        <View className="mt-10">
          <Text className="mb-2">{t('userInfo.tag4')}</Text>
          <TextInput className="bg-transparent" value={personalSignature} onChangeText={(t) => setPersonalSignature(t)} />

        </View>
        <View className="h-32 mt-auto  justify-start">
          <Button
            mode="outlined"
            style={{
              borderColor: '#FFFFFF',
              borderRadius: 33,
            }}
            labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
            contentStyle={{ height: 50 }}
            onPress={handleNext}
          >
            {t('userInfo.tag5')}
          </Button>
        </View>
      </View>
    </BaseLayout>);

};


export default UserInfo;
