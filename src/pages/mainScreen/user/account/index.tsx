import BaseLayout from '@components/baselayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { Button, Divider, List, Text } from 'react-native-paper';
import { RootStackParamList, UsertackParamList } from '@router/type';
import { useImmer } from 'use-immer';
import storage from '@storage/index';
import { resetGenericPassword } from 'react-native-keychain';
import { useRequest } from 'ahooks';
import { detailsById } from '@api/user';
// 引入
import { CommonActions } from '@react-navigation/native';
import { cssInterop } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';


cssInterop(Button, {
  className: 'style'
})

const Account = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation()
  useRequest(detailsById, {
    onSuccess: (res) => {
      console.log(res);

      setData((draft) => {
        draft.info[0].description = res.data?.phone ?? t('account.set2');
        draft.info[1].description = res.data?.setPassword ? t('account.set1') : t('account.set2');
        draft.info[2].description = res.data?.setPayPassword ? t('account.set1') : t('account.set2');
        draft.third[0].description = res.data?.wxOpenid ?? t('account.set1');
        // draft.third[0].description = res.data?.wxOpenid ? '已设置' : '未设置';
        // draft.third[0].description = res.data?.wxOpenid ? '已设置' : '未设置';
      })

    }
  });



  const [data, setData] = useImmer({
    refreshing: false,
    info: [
      { id: 'AccountPhone', title: t('account.tag2'), description: t('account.set2') },
      { id: 'AccountLoginPwd', title: t('account.tag3'), description: t('account.set2') },
      { id: 'AccountPayPwd', title: t('account.tag4'), description: t('account.set2') },
      // { id: '3', title: '第三方账号绑定', description: '未设置' },
    ],
    third: [
      // { id: 'AccountPhone', title: 'Apple ID', description: '0056-85649653' },
      // { id: '1', title: 'Google', description: '未设置' },
      // { id: '2', title: 'Facebook', description: '未设置' },
      // { id: '3', title: 'X', description: '未设置' },
      { id: '4', title: 'WeChat', description: t('account.set2') },
    ],
  });

  async function handleOut() {
    //退出登录
    await storage.clearMap();
    await resetGenericPassword();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'HomeTabs' },
        ],
      })
    )


  }
  const handleItemPress = (item) => {
    navigation.navigate(item.id);
  };
  const right = (item) => {
    return (<View className=" flex-row items-center">
      <Text className="text-[#ffffff7f] font-light text-xs">{item.description}</Text>
      <List.Icon icon="chevron-right" color="#ffffff7f" />
    </View>);

  };

  const renderItem = ({ item }) => {
    return (<List.Item title={item.title} className="bg-[#00000000]" background={'#00000000'} onPress={() => handleItemPress(item)} right={() => right(item)} />);
  };


  return (<BaseLayout className="bg-[#0B0B0BFF]">
    <ScrollView className="p-2">
      <Text className="pl-2 font-bold my-4">{t('account.tag1')}</Text>
      <View className="rounded-xl border border-[#343434] bg-[#191919]">
        <FlatList
          data={data.info}
          ItemSeparatorComponent={Divider}
          keyExtractor={(item) => item.id}
          renderItem={renderItem} />
      </View>

      <View className="p-2">
        <Text className="pl-2 font-bold my-4">{t('login.tag1')}</Text>
        <View className="rounded-xl border border-[#343434] bg-[#191919]">
          <FlatList
            data={data.third}
            ItemSeparatorComponent={Divider}
            keyExtractor={(item) => item.id}
            renderItem={renderItem} />
        </View>
      </View>
    </ScrollView>

    <SafeAreaView >
      <View className="p-5   bottom-0 left-0 right-0 fixed">
        <Button mode="outlined" className='w-full' style={{ borderColor: '#EE2737', borderRadius: 33 }}
          labelStyle={{
            fontSize: 18,
            color: '#EE2737',
            fontWeight: '600',
          }} onPress={handleOut} >
          {t('account.btn1')}
        </Button>
      </View>
    </SafeAreaView>

  </BaseLayout>);
};




export default Account;
