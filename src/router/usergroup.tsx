import { Stack } from './index';
import SystemMessage from '@pages/mainScreen/user/systemmessage';
import SystemMessageInfo from '@pages/mainScreen/user/systemmessage/info';
import Account from '@pages/mainScreen/user/account';
import loginPassword from '@pages/mainScreen/user/account/loginPassword';
import payPwd from '@pages/mainScreen/user/account/payPwd';



import Orders from '@pages/mainScreen/user/orders';
import OrdersInfo from '@pages/mainScreen/user/orders/info';
import Coupons from '@pages/mainScreen/user/coupons';
import Information from '@pages/mainScreen/user/information';

import Store from '@pages/mainScreen/user/store';
import Service from '@pages/mainScreen/user/service';
import Agreement from '@pages/mainScreen/user/agreement';

import PrivacyRule from '@pages/mainScreen/user/agreement/privacyRule';
import UserRule from '@pages/mainScreen/user/agreement/userRule';
import MyActive from '@pages/mainScreen/user/active/index';
import Customer from '@pages/mainScreen/user/customer/index';

import Result from '@pages/mainScreen/user/orders/result';
import Pay from '@pages/mainScreen/user/orders/pay';
import UserInfo from '@pages/mainScreen/user/userInfo';
import Cancellation from '@pages/mainScreen/user/account/Cancellation'

import { useTranslation } from 'react-i18next';


const LoginGroup = () => {
  const { t } = useTranslation();

  return <Stack.Group>
    <Stack.Screen
      name="SystemMessage"
      component={SystemMessage}
      options={{ title: t('default.titleList.SystemMessage') }}
    />


    <Stack.Screen
      name="SystemMessageInfo"
      component={SystemMessageInfo}
      options={{ title: '' }}
    />
    <Stack.Screen
      name="Account"
      component={Account}
      options={{ title: t('default.titleList.Account') }}
    />

    <Stack.Screen
      name="Service"
      component={Service}
      options={{ title: t('default.titleList.Service') }}
    />


    <Stack.Screen
      name="Store"
      component={Store}
      options={{ title: t('default.titleList.Store') }}
    />
    <Stack.Screen
      name="Agreement"
      component={Agreement}
      options={{ title: t('default.titleList.Agreement') }}
    />
    <Stack.Screen
      name="PrivacyRule"
      component={PrivacyRule}
      options={{ title: '' }}
    />
    <Stack.Screen
      name="UserRule"
      component={UserRule}
      options={{ title: '' }}
    />
    <Stack.Screen
      name="AccountLoginPwd"
      component={loginPassword}
      options={{ title: t('default.titleList.AccountLoginPwd') }}
    />
    <Stack.Screen
      name="AccountPayPwd"
      component={payPwd}
      options={{ title: t('default.titleList.AccountPayPwd') }}
    />

    <Stack.Screen
      name="AccountPhone"
      component={payPwd}
      options={{ title: t('default.titleList.AccountPayPwd') }}
    />


    <Stack.Screen
      name="MyActive"
      component={MyActive}
      options={{ title: t('default.titleList.MyActive') }}
    />


    <Stack.Screen
      name="Customer"
      component={Customer}
      options={{ title: t('default.titleList.Customer') }}
    />



    <Stack.Screen name="Orders" component={Orders} options={{ title: t('default.titleList.Orders') }} />
    <Stack.Screen name="OrdersInfo" options={{ title: t('default.titleList.ordersInfo') }} component={OrdersInfo}
      initialParams={{ orderContext: [] }}


    />
    <Stack.Screen name="Coupons" component={Coupons} options={{ title: t('default.titleList.Coupons') }} />
    <Stack.Screen name="Information" component={Information} options={{ title: t('default.titleList.Information') }} />
    <Stack.Screen name="Result" component={Result} options={{ title: t('default.titleList.Result'), presentation: 'modal', headerShown: false }} />
    <Stack.Screen name="Pay" component={Pay} options={{ title: '', presentation: 'modal' }} />
    <Stack.Screen name="EditUserInfo" component={UserInfo} options={{ title: t('default.titleList.UserInfo'), }} />
    <Stack.Screen name="Cancellation" component={Cancellation} />
  </Stack.Group>;
};

export default LoginGroup;
