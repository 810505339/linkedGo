
import BaseLayout from '@components/baselayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { UsertackParamList } from '@router/type';



const AccountSetPhone = () => {
  const navigation = useNavigation<NativeStackNavigationProp<UsertackParamList>>();
  const hadleNext = ()=>{
    navigation.navigate('AccountPhone');
  };                                       

  return (<BaseLayout>
    <View className="flex-auto mx-5 relative">
      <TextInput   value={'1111111'} className="mt-2.5  text-white"   />

      <Button className="absolute z-10 bottom-4 left-0 right-0"
          mode="outlined"
          style={{borderColor: '#EE2737', height: 50, borderRadius: 33,backgroundColor:'#EE2737'}}
          labelStyle={{
            fontSize: 18,
            color: '#0C0C0CFF',
            fontWeight: '600',
          }}
          contentStyle={{height: 50}}
          onPress={hadleNext}
         >
          修改手机号
        </Button>
    </View>
  </BaseLayout>);

};


export default AccountSetPhone;
