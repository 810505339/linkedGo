import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { UsertackParamList } from 'router/type';
import { checkAuth } from '@utils/checkAuth';


const CheckAuthLayout = () => {
  const navigation = useNavigation<NativeStackNavigationProp<UsertackParamList>>();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkAuth(true);
    });
    return unsubscribe;
  }, [navigation]);

  return (<></>)

};

export default CheckAuthLayout;
