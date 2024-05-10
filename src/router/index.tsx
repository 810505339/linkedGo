import { NavigationContainer, DefaultTheme, createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { adaptNavigationTheme } from 'react-native-paper';
import useSysLanguage from '@hooks/useSysLanguage';
import { RootStackParamList } from './type';
import Demo from '@pages/demoScreen/index';
import Chat from '@pages/mainScreen/im/chat.tsx';
import IM from '@pages/demoScreen/im/index';
import AnimatedScreen from '@pages/demoScreen/animated';
import Carouseldemo from '@pages/demoScreen/carousel';
import CustomNavigationBar from '@components/appBar/customNavigationBar';
import HomeTabs from './HomeTabs';
import LoginGroup from './LoginGroup';
import Homegroup from './homegroup';
import UserGroup from './usergroup';
import FightGroup from './fightgroup';
import DemoGroup from './DemoGroup';
import BlurviewDEmo from '@pages/demoScreen/blurview';
import CouponsModal from '@pages/mainScreen/user/coupons/modal';
import AuthenticationCamera from '@pages/LoginScreen/authentication/camera';


const initialRouteName: keyof RootStackParamList = 'HomeTabs';
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export const Stack = createStackNavigator<RootStackParamList>();

export function replace(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    // navigationRef.navigate(name as any, params);
    navigationRef.reset({
      index: 1,
      routes: [
        { name: 'HomeTabs' },
        { name: name }
      ],
    });
    // navigationRef.dispatch(StackActions.replace(name, params))

  }
}

const { DarkTheme } = adaptNavigationTheme({ reactNavigationDark: DefaultTheme });
const AppNavigator = () => {

  return (
    <NavigationContainer theme={DarkTheme} ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{
        header: props => <CustomNavigationBar {...props} />,
        headerTransparent: true,
      }}>
        <Stack.Screen
          name="AuthenticationCamera"
          component={AuthenticationCamera}
          options={{ title: '', headerShown: false, }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="IM" component={IM} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Animated" component={AnimatedScreen} />
        <Stack.Screen name="Carouseldemo" component={Carouseldemo} />
        <Stack.Screen name="BlurviewDEmo" component={BlurviewDEmo} />
        {DemoGroup()}
        {LoginGroup()}
        {Homegroup()}
        {UserGroup()}
        {FightGroup()}


        <Stack.Screen name="CouponsModal" component={CouponsModal} options={{ presentation: 'modal' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
