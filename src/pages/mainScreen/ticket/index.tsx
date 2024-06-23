import { Image, ImageBackground, TouchableWithoutFeedback, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Button,
  Title,
  Paragraph, Text, Portal, Modal,
  Icon,
} from 'react-native-paper';
import {
  Tabs,
  TabScreen,
  TabsProvider,
  useTabIndex,
  useTabNavigation,
} from 'react-native-paper-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import BaseLayout from '@components/baselayout';
import Animated from 'react-native-reanimated';
import { useImmer } from 'use-immer';
import { memo, useCallback, useEffect, useRef } from 'react';
import { checkAuth } from '@utils/checkAuth';
import { useNavigation } from '@react-navigation/native';
import CheckAuthLayout from '@components/baselayout/checkLayout';
import { useRequest } from 'ahooks';
import { genQrCodeStr, myTicket } from '@api/ticket';
import CustomFlatList from '@components/custom-flatlist';
import QRCode from 'react-native-qrcode-svg';
import { cssInterop } from 'nativewind'
import { useTranslation } from 'react-i18next';
import MyModal from '@components/modal';

cssInterop(Image, {
  className: 'style'
})

enum TICKET {
  非赠票 = 'NORMAL',
  未赠送 = 'NOTGIVEN',
  已赠送 = 'GIVEN'
}

const expiredIcon = require('@assets/imgs/ticket/expired.png');
const usedIcon = require('@assets/imgs/ticket/used.png');

const qrCodeImage = require('@assets/imgs/base/qrcode.png');
const modalBg = require('@assets/imgs/modal/ticket-head-bg.png');
const modalIcon = require('@assets/imgs/modal/ticket-icon.png');

const card_2 = require('@assets/imgs/base/card_2.png');
const bg = require('@assets/imgs/base/fightwineBg.png');

const closeIcon = require('@assets/imgs/base/close.png')

const style = StyleSheet.create({
  modal: {

  },
});


const Item = memo<any>((props: any) => {
  const { t } = useTranslation()

  const { entranceDate, usableTimeBegin, usableTimeEnd, areaName, boothName, usageType, latestArrivalTime, handleItemPress, ticketPicture, remainNum, status, cusTicketId, winePartyName, storeName } = props;

  const isShowQr = status === 'UNUSED'
  let img = null

  if (status === 'USED') {
    img = usedIcon
  }

  if (status === 'EXPIRED') {
    img = expiredIcon
  }
  /* 门票 */
  const cardImg = usageType === 'BOOTH' ? card_2 : bg

  const useTime = usageType === 'TICKET' ? `${usableTimeBegin}-${usableTimeEnd}${t('ticket.tag1')}` : `${t('ticket.tag2')} ${latestArrivalTime}`;
  const NumberRender = <View className="bg-[#000000] rounded-xl absolute p-2 bottom-2 left-5">
    <Text>
      x
      <Text className="font-bold ">{remainNum}</Text>
    </Text>
  </View>;




  return <TouchableWithoutFeedback onPress={() => handleItemPress(cusTicketId)}>
    <View className="mx-10 h-32 bg-[#FFFFFF1A]  my-3 relative   justify-center flex-row items-center rounded-xl border py-5 " onStartShouldSetResponderCapture={(ev) => true}>
      {img && <Image source={img} className='absolute bottom-0 right-0 h-32  w-32' resizeMethod='scale' />}
      <View className="w-36 h-24 relative  rounded-xl -left-5 ">

        {ticketPicture && <Image source={{ uri: ticketPicture }} className="w-36 h-24 rounded-xl" />}
        {!ticketPicture && <Image source={cardImg} className="w-36 h-24 rounded-xl" />}
        {NumberRender}
      </View>
      <View className=" flex-grow  overflow-hidden flex-col relative ">
        <View>
          <Text className="text-white text-lg font-600">{entranceDate}</Text>
          <Text className="text-[#ffffff7f] text-xs" >{useTime}</Text>
        </View>
        <View className='mt-2'>
          <Text className="text-sm">{storeName}</Text>
          <Text className="text-sm">{areaName}{boothName && `  -  ${boothName}`}</Text>
          {winePartyName && <Text className='text-xs'>{winePartyName}</Text>}
        </View>
        {isShowQr && <View className="bg-[#FFFFFF33] w-5 h-5 rounded border border-red-100 absolute z-10 right-5 flex items-center justify-center " >
          <Image source={qrCodeImage} className="w-4 h-4" />
        </View>}
      </View>
    </View>
  </TouchableWithoutFeedback>;
});

const TicketScreen = () => {

  const { t } = useTranslation();

  const timeId = useRef<NodeJS.Timeout>() /* 这是轮询的id */

  const tabs = [
    {
      title: t('ticket.header1'),
      status: 'UNUSED',
    },
    {
      title: t('ticket.header2'),
      status: 'USED',
    },
    {
      title: t('ticket.header3'),
      status: 'EXPIRED',
    },
  ];
  const navigation = useNavigation();
  const [data, setData] = useImmer({
    defaultIndex: 0,
    visible: false,
    qrCode: '',
    givenStatus: TICKET.非赠票,
    givenTime: '',


  });

  const containerStyle = { background: '#1E1E1E', padding: 20, margin: 20 };

  // useRequest(myTicket, {
  //   onSuccess: (res) => {
  //     console.log(res);

  //   },

  // });

  const hideModal = () => {
    setData(draft => {
      draft.visible = false;
    });
    clearInterval(timeId.current);
  };

  const api = useCallback(myTicket, []);


  const handleItemPress = async (id: string) => {

    if (data.defaultIndex != 0) {
      return
    }
    console.log(id, 'id')
    const res = await genQrCodeStr(id)

    console.log(res?.data?.data?.qrCodeStr)
    setData(draft => {
      draft.visible = true;
      draft.qrCode = res?.data?.data?.qrCodeStr
      draft.givenStatus = res?.data?.data?.givenStatus
      draft.givenTime = res?.data?.data?.givenTime
    });
    timeId.current = setInterval(async () => {
      const res = await genQrCodeStr(id)
      setData(draft => {
        draft.qrCode = res?.data?.data?.qrCodeStr
        draft.givenStatus = res?.data?.data?.givenStatus
        draft.givenTime = res?.data?.data?.givenTime
      });
    }, 60000)
  }


  const handleChangeIndex = (index: number) => {
    setData(draft => {
      draft.defaultIndex = index;
    });
  };

  const send = () => {

  }
  const getId = useCallback((item: any) => item.cusTicketId, []);


  return (
    <BaseLayout >
      {/* <CheckAuthLayout /> */}
      <View className='relative  w-full   top-24 flex-row  justify-center'>
        <Icon source={'alert-circle'} size={12} color={'rgba(255, 255, 255, 0.5)'} />
        <Text className=' opacity-50  text-xs ml-2' numberOfLines={2}>{t('ticket.tip1')} </Text>
      </View>
      <TabsProvider
        defaultIndex={data.defaultIndex}
        onChangeIndex={handleChangeIndex}
      >
        <Tabs
          uppercase={true} // true/false | default=true (on material v2) | labels are uppercase
          // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
          // iconPosition // leading, top | default=leading
          style={{ backgroundColor: 'transparent' }} // works the same as AppBar in react-native-paper
          dark={true} // works the same as AppBar in react-native-paper
          // theme={} // works the same as AppBar in react-native-paper
          mode="scrollable" // fixed, scrollable | default=fixed
          showLeadingSpace={false} //  (default=true) show leading space in scrollable tabs inside the header
          disableSwipe={false} // (default=false) disable swipe to left/right gestures
        >

          {
            tabs.map((tab, index) => (
              <TabScreen label={tab.title} key={index}>
                <View className="bg-transparent mt-10">
                  {index === data.defaultIndex && <CustomFlatList keyExtractor={getId} params={{ status: tabs[index].status }} renderItem={(item) => <Item  {...item} status={item.status} handleItemPress={handleItemPress} />} onFetchData={api} />}
                </View>
              </TabScreen>
            ))
          }

        </Tabs>
      </TabsProvider>

      <Portal>
        <MyModal visible={data.visible} onDismiss={hideModal} contentContainerStyle={containerStyle} dismissable={false}>
          <View className="bg-[#1E1E1E] relative flex items-center  pb-5  border  rounded-2xl  " style={style.modal}>
            <ImageBackground source={modalBg} className="w-full h-44 absolute -z-0" />
            <Image source={modalIcon} className="absolute -top-10" />
            <View className="rounded-xl border p-2.5 bg-white flex flex-row items-center justify-center mt-28">
              <QRCode
                value={data.qrCode}
                size={180}
                logoBackgroundColor="transparent" />
            </View>

            {/* <View className=' mt-5'>
              { (<View className='flex flex-row items-center  justify-between   w-full px-12'>
                <Text>此票可赠送</Text>
                <Button mode={'elevated'} className="bg-[#EE2737FF]  font-bold " contentStyle={{ padding: 0 }} 
                onPress={send}
                textColor="#000000FF" 
                >赠送</Button>
              </View>)}


            </View> */}

            {data.givenStatus != TICKET.非赠票 && (<View className=' mt-5'>
              {data.givenStatus === TICKET.未赠送 ? (<View className='flex flex-row items-center  justify-between   w-full px-12'>
                <Text>{t('ticket.tip1')}</Text>
                <Button mode={'elevated'} className="bg-[#EE2737FF]  font-bold " contentStyle={{ padding: 0 }} textColor="#000000FF" >{t('ticket.btn1')}</Button>
              </View>) : <View>
                <Text>{data.givenTime}</Text>
              </View>}


            </View>
            )}
          </View>

          <TouchableOpacity onPress={hideModal} className='flex-row  items-center justify-center mt-10' >
            <Image source={closeIcon} className='w-6 h-6' />
          </TouchableOpacity>
        </MyModal>
      </Portal>
    </BaseLayout>
  );
};
export default TicketScreen;
