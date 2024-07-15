import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@pages/mainScreen/home';
import TicketScreen from '@pages/mainScreen/ticket';
import FightwineScreen from '@pages/mainScreen/fightwine';
import UserScreen from '@pages/mainScreen/user';
import { TabParamList } from './type';
import { Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { store } from '@storage/store/versionStore';


const HOMEICON = require('@assets/imgs/bottombar/home.png');
const HOMEICONACTIVE = require('@assets/imgs/bottombar/home_active.png');
const FIGHTWINEICON = require('@assets/imgs/bottombar/fightwine.png');
const FIGHTWINEICONACTIVE = require('@assets/imgs/bottombar/fightwine_active.png');
const TICKETCICON = require('@assets/imgs/bottombar/ticket.png');
const TICKETCICONACTIVE = require('@assets/imgs/bottombar/ticket_active.png');
const USERICON = require('@assets/imgs/bottombar/user.png');
const USERICONACTIVE = require('@assets/imgs/bottombar/user_active.png');




const { Navigator, Screen } = createBottomTabNavigator<TabParamList>();

const HomeTabs = () => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log('tabs', store.app.sensitivenessOn)
  }, [store.app.sensitivenessOn])


  return (
    <Navigator initialRouteName="Home" screenOptions={({ route }) => {
      return {
        gestureEnabled: false,
        headerTransparent: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#E6A055FF',
        tabBarItemStyle: {
          display: 'flex',
          position: 'relative',

        },
        tabBarStyle: {
          backgroundColor: '#0B0B0BE6',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({ focused }) => {
          let image;
          if (route.name == 'Home') {
            image = focused ? HOMEICONACTIVE : HOMEICON;
          }

          if (route.name == 'Fightwine') {
            image = focused ? FIGHTWINEICONACTIVE : FIGHTWINEICON;
          }
          if (route.name == 'Ticket') {
            image = focused ? TICKETCICONACTIVE : TICKETCICON;
          }
          if (route.name == 'User') {
            image = focused ? USERICONACTIVE : USERICON;
          }
          return (image && <Image style={{ width: 28, height: 28 }} source={image} />);
        },
      };
    }}>
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Fightwine" options={{ title: t('default.titleList.fightwine') }} component={FightwineScreen} />
      <Screen name="Ticket" options={{
        title: t('default.titleList.ticket'),
        tabBarButton: (props) => store.app.sensitivenessOn === '0' ? <TouchableOpacity {...props} activeOpacity={1} /> : <TouchableOpacity {...props} activeOpacity={1} />,


      }} component={TicketScreen} />
      <Screen name="User" options={{ title: t('default.titleList.user') }} component={UserScreen} />
    </Navigator>
  );
};

export default HomeTabs;
