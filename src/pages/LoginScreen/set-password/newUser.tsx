import BaseLayout from '@components/baselayout';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import PswInput from './components/pswInput';
import { cssInterop } from 'nativewind';

cssInterop(PswInput, {
  className: {
    target: "style",
  },
})
const bgImage = require('@assets/imgs/login/login-register-bg.png');

const NewUser = () => {
  return (
    <BaseLayout source={bgImage}>
      <View className="mx-5 mt-11">
        <PswInput label="请输入密码" isBg={true} />
        <View className="mt-12">
          <PswInput label="确认密码" isBg={true} />
        </View>
      </View>
      <View className="absolute left-5 right-5 bottom-0  h-32">
        <Button
          mode="outlined"
          style={{
            borderColor: '#FFFFFF',
            height: 50,
            borderRadius: 33,
          }}
          labelStyle={{ fontSize: 18, color: '#FFFFFF', fontWeight: '600' }}
          contentStyle={{ height: 50 }}>
          登录
        </Button>
      </View>
    </BaseLayout>
  );
};

export default NewUser;
