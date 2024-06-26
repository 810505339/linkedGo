import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ImageSourcePropType } from 'react-native';
export type RootStackParamList = {
  CouponsModal: {
    storeId?: string
    ticketId?: string
    activityId?: string
    boothId?: string
    winePartyMode?: string
    useScope?: string //使用范围
  },
  LoginOrRegister: {
    authCode?: string
  },
  Login: undefined,
  NewUser: undefined,
  OldUser: {
    phone: string
    phoneAreaCode: string
  },
  Chat: any,
  Verification: {
    phone: string,
    authCode?: string,
    phoneAreaCode: string
  },
  AuthenticationSex: undefined,
  AuthenticationPower: undefined,
  Authentication: undefined,
  AuthenticationCamera: undefined,
  AuthenticationFacestatus: {
    status: number
  },
  UserInfo: undefined,
  HomeTabs: undefined,
  Demo: undefined,
  IM: undefined,
  Animated: undefined,
  Carouseldemo: undefined,
  AccountLoginPwd: undefined,
  AccountPayPwd: undefined,
  Store: undefined,
  Agreement: undefined,
  Service: undefined,
  UserRule: undefined,
  PrivacyRule: undefined,
  MyActive: undefined,
  PresetRule: {
    type: string
  },
  Radio: undefined,
  Customer: undefined

} & UsertackParamList & HomeParamList & FightParamList;

export type UsertackParamList = {
  Orders: undefined,
  Result: {
    orderId: string,
    type: string
  },
  OrdersInfo: {
    orderContext?: { label: string, value: any }[]
    headerImg?: ImageSourcePropType,
    submit?: (parmas: any) => Promise<{ orderId: string }>,  /* 优惠券id */
    couponId?: string, /* 优惠券id */
    useScope?: 'TICKET' | 'WINE_PARTY' | 'BOOTH' | 'ACTIVITY' /* 使用范围 */
    storeId: string
    ticketId?: string
    activityId?: string
    boothId?: string
    winePartyMode?: string
    amount?: string,
    orderStatus?: string, //订单状态
    orderId?: string, //订单id
    feeAmount?: string, //服务税
    taxAmount?: string,//消费税
  },
  SystemMessage: undefined,
  SystemMessageInfo: {
    id: string //消息id
  },
  Account: undefined,
  AccountPhone: undefined,
  AccountSetPhone: undefined,
  Coupons: undefined,
  Information: undefined,
  Offlinepush: undefined,
  WeChat: undefined
}

export type HomeParamList = {
  Preset: undefined,
  Dynamic: undefined,
  DynamicInfo: {
    id: string
    // tagList: string[],
    // title: string,
    // content: string,
    // publishDate: string,
    // pageView: string,
    // source: {
    //   uri: string
    // }
  },
  ReserveBooth: undefined,
  ConfirmBooth: {
    storeId: string,
    areaId: string,
    areaName: string,
    entranceDate: string
    peopleNum: number,
    latestArrivalTime: string
  },
  FightwineDetail: {
    partyId: string
  },
  MyWineParty: {

  },
  Pay: {
    orderId: string
    orderStatus: string,
    codeUrl: string,
    codeExpireSecond: string,
    amount: string
  },
  EditUserInfo: undefined,
  Cancellation: undefined
}

export type TabParamList = {
  Home: undefined,
  Fightwine: undefined,
  Ticket: undefined,
  User: undefined,
};




export type FightParamList = {
  Launch: undefined,
  LaunchWine: {
    winePartyMode: string
    modeName: string
  },
  Booths: {
    [propName: string]: string
  }
}
export type ScreenNavigationProp<T extends keyof RootStackParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList, T>,
>;
