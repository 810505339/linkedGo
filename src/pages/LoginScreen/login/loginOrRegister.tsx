import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Button, Checkbox, Text } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { RootStackParamList } from '@router/type';
import BaseLayout from '@components/baselayout';
import Toast from 'react-native-toast-message';
import { sendYzmApi, allPhoneAreaCode } from '@api/login';
import { useRequest } from 'ahooks';
import { cssInterop } from 'nativewind';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import CustomModal from '@components/custom-modal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useImmer } from 'use-immer';
import { loadLanguageStorage } from '@storage/language/action';
const bgImage = require('@assets/imgs/login/login-register-bg.png');


cssInterop(TextInput, {
  className: {
    target: "style",
  },
});

const LoginOrRegister = () => {
  const [phone, setPhone] = useState('');
  const [checked, setChecked] = useState(false);
  const [alldata, setAllData] = useImmer({
    codeList: [],
    selectItem: { areaCode: "86", "countryEn": "China", "countryZh": "中国", "nameCode": "CN" }
  })
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation()
  const route = useRoute<RouteProp<RootStackParamList, 'LoginOrRegister'>>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { run } = useRequest(allPhoneAreaCode, {
    manual: true,
    onSuccess: async (res) => {
      const data = res.data
      if (data.success) {
        const { language } = await loadLanguageStorage();


        const codeList = data.data.map((item) => {
          let name = ''
          if (language === 'en') {
            name = `${item.countryEn}(${item.areaCode})`
          } else {
            name = `${item.countryZh}(${item.areaCode})`
          }
          return {
            name: name,
            id: item.nameCode,
            areaCode: item.areaCode
          }
        })
        setAllData((draft) => {
          draft.codeList = codeList
        })
      }

    }
  })

  const { authCode } = route.params
  const { loading, runAsync } = useRequest(() => sendYzmApi({
    mobile: phone,
    phoneAreaCode: alldata.selectItem.areaCode
  }), {
    manual: true,
  });

  //密码登录
  function handlePwsLogin() {
    /* 是否允许通过 */
    const isPass = verify();

    if (isPass) {
      /* 密码登录 */
      navigation.navigate('OldUser', {
        phone: phone,
        phoneAreaCode: alldata.selectItem.areaCode
      });
    }

  }

  //
  async function handleVerification() {
    const isPass = verify();
    //发送验证码
    if (isPass) {
      try {
        const { data } = await runAsync();
        if (data) {
          navigation.navigate('Verification', {
            phone,
            authCode,
            phoneAreaCode: alldata.selectItem.areaCode
          });
        }
      } catch (err) {

      }
    }






  }
  /* 验证规则是否通过 */
  function verify() {
    if (!checked) {
      Toast.show({ text1: '请勾选' });
      return false;
    }

    if (phone.length !== 11 && phone.length !== 8) {
      Toast.show({ text1: '手机号错误' });
      return false;
    }
    return true;
  }
  /* 选择地区 */
  function handleSelectArea() {
    bottomSheetModalRef.current?.present()

  }
  /* 点击选择地区 */
  function setCode(item: any) {

    setAllData(draft => {
      draft.selectItem = item
    })
    bottomSheetModalRef.current?.dismiss()

  }

  function toRule(type: string) {
    if (type = 'p') {
      navigation.navigate('PrivacyRule');
    } else {
      navigation.navigate('UserRule');
    }

  }

  useEffect(run, [])



  return (
    <BaseLayout source={bgImage} loading={loading}>
      <View className="mx-5 mt-11">
        <View>
          <Text className="text-[#ffffff7f] text-sx">{t('login.tag2')}</Text>
        </View>
        <View className="flex-row items-center mt-4 ">
          <TextInput
            keyboardType="numeric"
            className="bg-transparent  font-bold text-2xl"
            showSoftInputOnFocus={false}
            value={alldata.selectItem.areaCode}
            right={<TextInput.Icon icon="menu-down" color="#EE2737" onPressIn={handleSelectArea} onPress={handleSelectArea} />}
            onPressIn={handleSelectArea}
          />
          <Text className="font-bold text-4xl ml-2 mr-1">-</Text>
          <TextInput
            keyboardType="numeric"
            maxLength={11}
            value={phone}
            onChangeText={text => setPhone(text)}
            className="bg-transparent flex-grow font-bold text-2xl"
          />

        </View>
        <View className="flex-row items-start justify-start  mt-6 relative">
          <View>
            <Checkbox.Android
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
          <View className="flex-1 ">
            <Text className="text-[#ffffff7f]">
              {t('login.tag11')}
              <TouchableOpacity onPress={() => toRule('p')}>
                <Text className="text-[#EE2737]">{t('login.tag7')}</Text>
              </TouchableOpacity>

              {t('login.tag12')}
              <TouchableOpacity onPress={() => toRule('u')}>
                <Text className="text-[#EE2737]">{t('login.tag8')}</Text>
              </TouchableOpacity>

            </Text>
          </View>
        </View>
      </View>
      <View className=" absolute bottom-36 left-0 right-0 mt-96 mx-5  flex-auto   flex-row justify-between">
        <View>
          {!authCode && <Button
            mode="outlined"
            style={{
              borderColor: '#FFFFFF',
              borderRadius: 33,
            }}
            labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
            contentStyle={{ height: 50 }}
            onPress={handlePwsLogin}>
            {t('login.btn2')}
          </Button>}

        </View>
        <View>
          <Button
            mode="outlined"
            style={{
              borderColor: '#FFFFFF',

              borderRadius: 33,
            }}
            labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
            contentStyle={{ height: 50 }}
            onPress={handleVerification}>
            {t('login.btn3')}
          </Button>
        </View>
      </View>
      <CustomModal ref={bottomSheetModalRef} data={alldata.codeList} headerText={t('user.header6')} selectValue={alldata.selectItem.areaCode} onPress={setCode} snapPoints={['50%']} />
    </BaseLayout>
  );
};

export default LoginOrRegister;
