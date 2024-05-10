import { getGenericPassword } from 'react-native-keychain';
import { navigationRef } from '@router/index';
export const checkAuth = async (goBack: boolean = false) => {
  const data = await getGenericPassword();
  if (!data) {
    if (navigationRef.isReady()) {
      if (goBack) {
        navigationRef.goBack();
      }
      navigationRef.navigate('Login');
    }
  } else {
    return data.password;
  }
};


