import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BaseLayout from '@components/baselayout';
import { ImageBackground, View, TextInput, TouchableOpacity, Image, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Button, Divider, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { RootStackParamList } from '@router/type';
import { useRequest } from 'ahooks';
import { joinWineParty, winePartyByDetail, cancelWineParty, kickOut, joinApproval, quitWineParty, checkNeedLockConfirm, lockConfirm, commentPage, submitComment } from '@api/fightwine';
import { ScrollView } from 'react-native-gesture-handler';

import uuid from 'react-native-uuid';
import { useImmer } from 'use-immer';
import useUpdateFile, { IUpdateImage } from '@hooks/useUpdateFile';
import { ImageLibraryOptions } from 'react-native-image-picker';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TencentImSDKPlugin } from 'react-native-tim-js';
import Dialog from '@components/dialog';
import Toast from 'react-native-toast-message';
import useUserInfo from '@hooks/useUserInfo';
import { BlurView } from '@react-native-community/blur';
import CheckSex from '@components/baselayout/checkSex';
import { findIndex } from '@store/shopStore';
import currency from 'currency.js';
import useSelectShop from '@hooks/useSelectShop';
import { useLayer } from '@hooks/useLayer';
import ShareLayer from './components/ShareLayer';

import MyModal from '@components/modal';
import Loading from '@components/baselayout/loading';


const femaleAvatarBg = require('@assets/imgs/fightwine/femaleAvatarBg.png');
const maleAvatarBg = require('@assets/imgs/fightwine/maleAvatarBg.png');
const playerTypeIcon = require('@assets/imgs/fightwine/playerTypeIcon.png');
const headerIcon = require('@assets/imgs/user/header.png')
const closeIcon = require('@assets/imgs/base/close.png')
const maleIcon = require('@assets/imgs/fightwine/maleIcon.png');
const famaleIcon = require('@assets/imgs/fightwine/famaleIcon.png');
const manIcon = require('@assets/imgs/user/man.png');
const womanIcon = require('@assets/imgs/user/woman.png');

const manHeaderIcon = require('@assets/imgs/user/header.png');
const womanHeaderIcon = require('@assets/imgs/user/header1.png');
const card_1 = require('assets/imgs/base/fightwineBg.png');
export enum STATE {
  '未开始' = 'WAIT_START',
  '进行中' = 'IN_PROGRESS',
  '待入场' = 'WAIT_ENTER',
  '已入场' = 'ENTERED',
  '已取消' = 'CANCELED',
  '已结束' = 'FINISHED'
}


const containerStyle = { background: '#1E1E1E', padding: 20, margin: 20 };

type InfoType = {
  title: string;
  value: string;
  key: string;

}
type IPeopleType = {
  id: string,
  gender: string,
  avatarUrl: string,
  name: string,
  playerButton?: string
  playerType?: string
  onClickPlayButton: (index: number) => void,
  index: number,
  joinStatus?: string
}

enum IDialogState {
  踢人 = 1,
  取消 = 2,
  审核 = 3,
  退出 = 4,
  提前锁定 = 5
}

type IAllData = {
  infoList: InfoType[];
  peopleList: IPeopleType[];
  status: STATE,
  res: any,
  dialog: {
    context: string,
    visible: boolean,
    visible1: boolean,
    state: IDialogState,
    cancelText: string,
    confirmText: string
    btn?: string
  }
  player?: IPeopleType,
  visible: boolean //分享弹窗
}



/* 用户item */
const PeoPleItem = (props: IPeopleType) => {
  const { avatarUrl, gender, name, playerButton, playerType, index, onClickPlayButton, joinStatus } = props;
  console.log(props, '单个用户');
  /* 拥有状态的是用户 */

  const sexHeaderIcon = gender === '1' ? manHeaderIcon : womanHeaderIcon;

  const avatarBg = gender == '2' ? femaleAvatarBg : maleAvatarBg;
  /* 审核提出按钮 */
  const playerButtonRender = playerButton && (<TouchableOpacity onPress={() => onClickPlayButton(index)} className="border border-white rounded-xl ">
    <Text className="text-xs py-1 px-2 text-center">{playerButton}</Text>
  </TouchableOpacity>);

  /* 发起人 */
  const playerTypeRender = playerType === 'PROMOTER' && (<Image source={playerTypeIcon} />);
  console.log(joinStatus && avatarUrl, 'joinStatus  &&  avatarUrl');

  const defaultAvatarUrl = gender === '1' ? maleIcon : famaleIcon
  const color = gender === '1' ? 'bg-[#E6A055FF]' : 'bg-[#EE2737FF]'


  return <View>
    <View className="flex flex-row items-center justify-between h-12 relative ">

      <ImageBackground source={avatarBg} className="w-full h-full absolute -z-10" />
      <View className="px-5 py-3 flex flex-row items-center">
        <View className={`border-2 border-[#000000FF] w-6 h-6 rounded-full overflow-hidden relative flex-row items-center justify-center ${color}`}>
          {joinStatus && <BlurView
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, zIndex: 10 }}
            blurAmount={10}
            blurType="light"
            reducedTransparencyFallbackColor="transparent" />}
          {avatarUrl && <Image source={{ uri: avatarUrl }} resizeMode='cover' className="w-4 h-4" />}
          {!avatarUrl && joinStatus && <Image source={sexHeaderIcon} resizeMode='cover' className={`w-4 h-4 `} />}
          {!avatarUrl && !joinStatus && <Image source={defaultAvatarUrl} resizeMode='cover' className={`w-4 h-4 `} />}
        </View>
        <Text className="ml-2 flex-auto">{name}</Text>
        {playerButtonRender}
        {playerTypeRender}
      </View>
    </View>
    <Divider />
  </View>;
};

/* 评价 */
const Appraise = forwardRef((props: any, childRef: any) => {
  const { item } = props;

  console.log(item, '评价的详情');
  const { data: res } = useRequest(() => commentPage(item.id))



  const { t } = useTranslation();

  type IData = {
    visible: boolean,
    option: ImageLibraryOptions,
    selectImage?: IUpdateImage,
    content: string,
    loading: boolean
  }
  const [data, setData] = useImmer<IData>({
    option: {
      mediaType: 'photo',
      // maxWidth: 600,// 设置选择照片的大小，设置小的话会相应的进行压缩
      // maxHeight: 600,
      quality: 0.8,
      selectionLimit: 4,
    },
    visible: false,
    selectImage: undefined,
    content: '',
    loading: false
  });

  const { handleChooseImage, imageList, deleteImage } = useUpdateFile(data.option);
  const window = useWindowDimensions();

  useImperativeHandle(childRef, () => ({
    ...data,
    imageList
  }))

  /* 点击上传酒局评价 */
  const onChooseImage = async () => {
    console.log(4 - imageList.length, 'imageList.length');
    setData(draft => {
      draft.loading = true;
    })
    const res = await handleChooseImage();
    console.log(res, '这是上传的图片哦');
    setData(draft => {
      draft.loading = false;
    })
  };
  /* 点击删除 */
  const onDeleteImage = (id: string) => {
    deleteImage(id);
  };
  /* 弹窗关闭 */
  const hideModal = () => {
    setData(draft => {
      draft.visible = false;
    });
  };
  /* 点击图片打开 */
  const onSelectImage = (image: IUpdateImage) => {
    setData(draft => {
      draft.visible = true;
      draft.selectImage = image;
    });
  };

  /* 点击评价图片 */

  const onClickArImage = (item: any) => {

    Image.getSize(item, (width, height) => {
      const w = window.width * 0.8;
      const h = (window.width * 0.8) * (height / width);
      console.log(h, 'height')
      onSelectImage({
        id: `${uuid.v4()}`,
        previewUrl: item,
        width: w,
        height: h
      })
    });


  }

  /* computed */
  const contentContainerStyle = data.selectImage && {
    margin: (window.width - data.selectImage.width) / 2,
  };

  /* useEffect */

  useEffect(() => {

    setData(draft => {
      draft.option.selectionLimit = 4 - imageList.length;
    });
    /*  */

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageList.length]);


  console.log(res?.data?.data, '这是评价酒局的详情');
  /* 评价列表 */
  const appraiseList = res?.data?.data ?? []


  return (<View className="m-5">
    {/* 酒局评价 */}
    <Text className="font-bold my-3">{t('wineDetail.title3')}</Text>
    {appraiseList.length <= 0 && <View className="bg-[#191919] border border-[#343434] rounded-xl h-24 justify-center items-center">
      <Text className="opacity-50 text-left" numberOfLines={2}>{t('wineDetail.appraise1')}</Text>
    </View>}
    {appraiseList.length > 0 && <View className="bg-[#191919] border border-[#343434] rounded-xl p-5">
      {appraiseList.map((appraise: any, i: number) => {
        console.log(appraise, 'appraise');
        const sexIcon = appraise.gender == 1 ? manHeaderIcon : womanHeaderIcon
        return <View key={i} className='mt-2'>
          <View className='flex-row items-center justify-between  '>
            {/* 用户头像 */}
            <View className='flex-row'>
              <View className="border-2 border-[#000000FF] w-6 h-6 rounded-full overflow-hidden relative">
                <BlurView
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, zIndex: 10 }}
                  blurAmount={10}
                  blurType="light"
                  reducedTransparencyFallbackColor="transparent" />
                {appraise.avatarUrl ? <Image source={{ uri: appraise.avatarUrl }} className="w-6 h-6 " /> : <Image source={sexIcon} className="w-6 h-6 " />}


              </View>
              {/* 评价者的名称 */}
              <Text className='w-24 ml-2' numberOfLines={1}>{appraise?.appraiser?.nickname}</Text>
            </View>
            <Text className=' opacity-50  text-10 '>{appraise?.commentTime}</Text>
          </View>
          <Text className="my-5">{appraise?.content}</Text>
          <View className='flex-row'>
            {appraise?.commentFileVOS?.map((c: any, j: number) => {
              return (<TouchableOpacity key={j} onPress={() => onClickArImage(c)}><Image source={{ uri: c }} className='w-20 h-20 border-2 m-2 rounded-md' /></TouchableOpacity>)
            })}
          </View>
        </View>
      })}
    </View>}

    {/* 评价本次酒局 */}
    {<View className="flex-row items-center space-x-2 my-3">
      <Text className="font-bold">{t('wineDetail.appraise2')}</Text>
      <Text className=" text-[#EE2737] font-normal text-xs">{t('wineDetail.appraise3')}</Text>
    </View>
    }

    {
      <View className="bg-[#191919] rounded-xl border-[#343434] p-2 max-h-30 overflow-y-scroll">
        <TextInput placeholder={t('wineDetail.appraise4')}
          editable
          maxLength={300}
          /* // ios fix for centering it at the top-left corner  */
          multiline
          numberOfLines={4}
          /* 仅限 Android  */
          textAlignVertical="top"
          className=' text-white'
          placeholderTextColor={'#343434'}
          value={data.content}
          onChangeText={(e) => setData((draft) => {
            draft.content = e
          })}
          style={{ height: 144, padding: 10 }}

        />
      </View>
    }

    {/* 上传图片 */}
    {
      <View className="flex-row  my-3 space-x-2">
        <Text className="font-bold">{t('wineDetail.appraise5')}</Text>
        <Text className="text-[#EE2737] font-normal text-xs">{t('wineDetail.appraise6')}</Text>
      </View>
    }

    {<View className="flex-row  space-x-2    items-center ">
      {imageList.map((image) => {
        return (<TouchableOpacity className="w-20 h-20 rounded relative mx-2 " key={image.id} onPress={() => onSelectImage(image)}>
          <IconButton icon="backspace-reverse"
            className="absolute z-20 -right-4 -top-4"
            iconColor={'#000'}
            size={14} onPress={() => onDeleteImage(image.id)} />
          <Image source={{ uri: image.previewUrl }} className="w-20 h-20 rounded" />
        </TouchableOpacity>);
      })}
      {imageList.length < 4 && <IconButton
        icon="plus-thick"
        iconColor={'#ffffff'}
        size={20}
        className=" w-20 h-20  bg-[#191919] border border-[#343434]"
        onPress={onChooseImage}
      />}

    </View>
    }



    {/* 点击图片查看弹窗 */}
    {
      data.visible && <Portal>

        <MyModal visible={data.visible} onDismiss={hideModal} contentContainerStyle={contentContainerStyle} >
          <View>
            <Image source={{ uri: data.selectImage?.previewUrl }} width={data.selectImage?.width} height={data.selectImage?.height} resizeMode="contain" />
          </View>
        </MyModal>
      </Portal>
    }


    {data.loading && <Loading />}

  </View >);
})

const FightwineDetail = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'FightwineDetail'>>();
  const { partyId } = route.params;
  const { t } = useTranslation();
  /* 评价的ref */
  const AppraiseDom = useRef()

  const infoList = [

    {
      title: t('wineDetail.info0'),
      value: '',
      key: 'modeName',
    },
    {
      title: t('wineDetail.info1'),
      value: '',
      key: 'status',
    },

    {
      title: t('wineDetail.info2'),
      key: 'partyName',
      value: '',
    },
    {
      title: t('wineDetail.info3'),
      value: '',
      key: 'entranceDate',
    },
    {
      title: t('wineDetail.info4'),
      value: '',
      key: 'latestArrivalTime',
    },
    {
      title: t('wineDetail.info5'),
      value: '',
      key: 'storeName',
    },
    {
      title: t('wineDetail.info6'),
      value: '',
      key: 'areaNameByBoothName',
    },
    {
      title: t('wineDetail.info7'),
      value: '',
      key: 'drinksMealName',
    },
  ];

  const [allData, setAllData] = useImmer<IAllData>({
    infoList,
    peopleList: [],
    status: STATE.未开始, //
    res: {},
    dialog: {
      context: '',
      visible: false,
      visible1: false,
      state: IDialogState.踢人,
      cancelText: t('common.btn6'),
      confirmText: t('common.btn2'),
    },
    visible: false //分享弹窗
  });
  const { userInfoStorage } = useUserInfo();

  const { userId, userSig, userInfo } = userInfoStorage;


  const { res, status, dialog } = allData;



  const { loading, run } = useRequest(() => winePartyByDetail(partyId), {
    onSuccess: async (res) => {
      let _data = res.data;
      if (!_data.drinksMealName) {
        _data.drinksMealName = t('confirmBooth.label3')
      }
      if (_data.isJoined && _data.playerType != 'FREE_PARTICIPANT' && _data.status == 'IN_PROGRESS') {
        const check = await checkNeedLockConfirm(partyId);
        console.log(check, 'check');

        setAllData((draft) => {
          /* 判断是否需要弹出提前锁定的窗口 */
          if (check.data) {
            draft.dialog.visible = true;
            draft.dialog.state = IDialogState.提前锁定;
            draft.dialog.context = `${t('wineDetail.context')}`
          }
        });
      }

      /* 需要填充的数量 */
      const _female = _data.femaleNum - _data.joinedFemaleList.length;
      const _male = _data.maleNum - _data.joinedMaleList.length;

      /* 需要填充的男女列表 */
      const needFillfemale = createPeople(_female, '2', t);
      const needFillmale = createPeople(_male, '1', t);

      setAllData(darft => {
        darft.peopleList = [..._data.joinedMaleList, ...needFillmale, ..._data.joinedFemaleList, ...needFillfemale];
        darft.infoList = darft.infoList.map(info => {
          if (info.key === 'areaNameByBoothName') {
            return {
              ...info,
              value: _data.areaName + ' - ' + _data.boothName,
            }
          }
          return {
            ...info,
            value: _data[info.key],
          };

        });
        darft.status = _data.status;
        darft.res = _data;
      });

    },
  });




  /* 点击确认按钮弹窗 */
  async function confirm() {
    if (dialog.state === IDialogState.提前锁定) {
      //提前锁定
      const { data } = await lockConfirm(partyId);
      console.log(data, '提前锁定');
      if (data) {
        Toast.show({
          text1: t('wineDetail.context1')
        });
      }
    }


    {
      if (dialog.state === IDialogState.取消) {
        /* 取消 */
        const { data } = await cancelWineParty(partyId);
        if (data) {
          //todo 刷新上一个页面
          navigation.goBack();
        }
      }
    }

    if (dialog.state === IDialogState.退出) {
      /* 取消 */
      const { data } = await quitWineParty(partyId);
      if (data.data) {
        //todo 刷新上一个页面
        navigation.goBack();
        return;
      }
    }

    if (dialog.state === IDialogState.踢人) {
      await kickOut({
        playerId: allData.player?.id,
        partyId,
      });
    }
    if (dialog.state === IDialogState.审核) {
      await joinApproval({
        playerId: allData.player?.id,
        partyId,
        pass: true,
      });
    }
    setAllData((draft) => {
      draft.dialog.visible = false;
      draft.dialog.visible1 = false;
    });
    /* 踢人跟审核都需要刷新详情 */
    run();
  }
  /* 点击全局取消按钮弹窗 */
  async function onDismiss() {
    if (dialog.state === IDialogState.审核) {
      await joinApproval({
        playerId: allData.player?.id,
        partyId,
        pass: false,
      });

      run();
    }
    setAllData((draft) => {
      draft.dialog.visible = false;
      draft.dialog.visible1 = false;
    });
  }
  /* 关闭弹窗 */
  async function cancel() {
    setAllData((draft) => {
      draft.dialog.visible = false;
      draft.dialog.visible1 = false;
    });
  }
  /* nav按钮组 */
  const NavBar = () => {
    const { shop } = useSelectShop()

    /* 点击加入酒局按钮 */
    const join = async () => {

      /* TODO 限制男女性别·  */
      const gender = userInfo?.gender
      const _female = res?.femaleNum - (res?.joinedFemaleList?.length ?? 0); //男剩余数量
      const _male = res?.maleNum - (res?.joinedMaleList?.length ?? 0); //女剩余数量

      console.log(gender, _female, '_female');
      console.log(gender, _male, '_male');

      if (gender == 1 && _male <= 0) {
        Toast.show({
          text1: t('Tip.man')
        })
        return
      }

      if (gender == 2 && _female <= 0) {
        Toast.show({
          text1: t('Tip.woman')
        })
        return
      }







      /* 请求加入酒局 */
      const feeRate = findIndex(shop.select.id)?.feeRate ?? 0
      const taxRate = findIndex(shop.select.id)?.taxRate ?? 0

      if (res.isNeedPay) {
        /* 需要支付跳转订单 */
        navigation.navigate('OrdersInfo', {
          headerImg: card_1,
          orderContext: [
            { label: t('orders.label1'), value: res.storeName },
            { label: t('orders.label10'), value: res.partyName },
            { label: t('orders.label2'), value: `${res.areaName} - ${res.boothName}` },
            { label: t('orders.label3'), value: res.drinksMealName },
            { label: t('orders.label4'), value: res.entranceDate },
            { label: t('orders.label6'), value: res.latestArrivalTime },

            { label: t('orders.label14'), value: res.modeName },
            // { label: t('orders.label11'), value: latestArrivalTime },
            { label: t('orders.label12'), value: res.maleNum },
            { label: t('orders.label13'), value: res.femaleNum },
            { label: t('orders.label7'), value: 'S$' + res.needPayAmount },
          ],
          amount: res.needPayAmount,
          winePartyMode: res.partyMode,/* 酒局模式 */
          useScope: 'WINE_PARTY', //使用范围
          storeId: shop.select.id,
          submit: async (params) => {
            /* 加入酒局成功以后 */
            const data = await joinSuccess({
              partyId,
              ...params,
            });
            return {
              orderId: data.orderId
            }
          },
          taxAmount: currency(res.needPayAmount).multiply(taxRate).divide(100),
          feeAmount: currency(res.needPayAmount).multiply(feeRate).divide(100),
        });


      } else {
        const data = await joinSuccess({ partyId });
        if (data) {
          Toast.show({
            text1: t('wineDetail.context2')
          });
          /* 刷新酒局 */
          run();
        }


      }



    };
    /* 跳转im开始聊天 */
    const nextIm = async () => {



      const loginRes = await TencentImSDKPlugin.v2TIMManager.login(userId, userSig);
      console.log(userId, userSig, 'loginRes');



      if (loginRes.code == 0) {
        navigation.navigate('Chat', {
          userID: userId,
          conversation: {
            conversationID: `c2c_${res.partyNo}`,
            showName: res.partyName,
            groupID: res.partyNo,
            type: 2,
            initialMessageList: [],
            // unMount: (message: V2TimMessage[]) => { },
          },
        });
      }
    };

    /* 加入酒局成功 */
    async function joinSuccess(params: any) {
      console.log(params);
      const { data } = await joinWineParty(params);



      return data;



    }
    /* 取消酒局 */
    const cancelWine = async () => {
      setAllData(draft => {
        draft.dialog.context = t('wineDetail.tag1');
        draft.dialog.visible = true;
        draft.dialog.state = IDialogState.取消;
      });
    };
    /* 退出酒局 */
    const quitWine = () => {
      setAllData(draft => {
        draft.dialog.context = t('wineDetail.tag2');
        draft.dialog.confirmText = t('wineDetail.btn11')
        draft.dialog.visible = true;
        draft.dialog.state = IDialogState.退出;
      });
    };
    /* 评价酒局 */
    const commented = async () => {
      const { content, imageList } = AppraiseDom.current!
      if (!content) {
        Toast.show({
          text1: '请输入评价'
        })
        return
      }
      const contentPic = ((imageList as []) ?? []).map((item: any) => item.id)
      console.log(AppraiseDom.current, 'AppraiseDom.current获取到的数据');

      await submitComment({ partyId: res.id, content: content, contentPic: contentPic })
      navigation.goBack()
    }

    const toTickUrl = () => {
      navigation.navigate('Ticket')
    }
    const NavButton = () => {
      /* 退出酒局 */
      if (res.quitButton) {
        return <Button mode={'elevated'} className="bg-[#EE2737FF]" textColor="#0C0C0CFF" onPress={quitWine}>{t('wineDetail.btn1')}</Button>;
      }
      /* 取消酒局 */
      if (res.cancelButton) {
        return <Button mode={'elevated'} className="bg-[#EE2737FF]" textColor="#0C0C0CFF" onPress={cancelWine}>{t('wineDetail.btn2')}</Button>;
      }

      console.log(res.isCommented, 'res.isCommented')
      /* 没评价过 */
      if (res.status === STATE.已入场 || res.status === STATE.已结束) {
        return <Button mode={'elevated'} className="bg-[#EE2737FF]" textColor="#0C0C0CFF" onPress={commented}>{t('wineDetail.btn9')}</Button>;
      }


      {
        if (res.isJoined && (res.status === STATE.已入场 || res.status === STATE.待入场) && res.joinStatus === 'IN') {
          return (
            <View className="flex-row  items-center justify-around gap-x-5">
              <Button mode={'outlined'} className="bg-[#101010]" style={{ borderColor: '#EE2737', flex: 1 }} labelStyle={{ fontWeight: 'bold' }} textColor="#EE2737FF" onPress={toTickUrl}   >{t('wineDetail.btn3')}</Button>
              <Button mode={'elevated'} className="bg-[#EE2737FF]" style={{ flex: 1 }} labelStyle={{ fontWeight: 'bold' }} textColor="#0C0C0CFF" onPress={nextIm} >{t('wineDetail.btn4')}</Button>
            </View >
          );

          /* 加入酒局 */
        } else if (res.status === STATE.进行中 || res.status === STATE.待入场) {
          if (res.isJoined) {
            return null
          }
          return <Button mode={'elevated'} className="bg-[#EE2737FF]" textColor="#0C0C0CFF" onPress={join}>{t('wineDetail.btn5')}</Button>;
        } else {
          return null;
        }
      }
    }



    return NavButton() && <View className="h-16  flex flex-row items-center  ">
      <View className="px-5  w-full">
        <NavButton />
      </View>
    </View>
  };


  /* 点击提出或者审核按钮 */
  async function onClickPlayButton(index: number) {
    /* 寻找点击的player */
    const _player = allData.peopleList[index];
    const KICK_OUT = _player.playerButton === 'KICK_OUT';
    console.log(_player);
    if (_player.playerButton) {
      setAllData((draft) => {
        draft.dialog.visible = KICK_OUT;
        draft.dialog.visible1 = !KICK_OUT;
        draft.dialog.state = KICK_OUT ? IDialogState.踢人 : IDialogState.审核;
        draft.dialog.context = KICK_OUT ? t('wineDetail.tag3') : t('wineDetail.tag4');
        draft.dialog.confirmText = KICK_OUT ? t('wineDetail.btn6') : t('wineDetail.btn7');
        draft.dialog.cancelText = KICK_OUT ? t('common.btn6') : t('wineDetail.btn8');
        draft.player = _player;
      });

    }
  }






  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setAllData(darft => {
              darft.visible = true
            })
          }}
          style={{ paddingRight: 10 }}
        >
          <Image source={require('./images/share_icon.png')} />
        </TouchableOpacity>
      ),
    })
  }, [navigation, res])

  const hideModal = () => {
    setAllData(darft => {
      darft.visible = false
    })
  };

  /* 如果没有验证人脸 */
  // if (!userInfo?.checkFace) {
  //   return <BaseLayout >
  //     <Text>请认证人脸</Text>
  //   </BaseLayout>;
  // }

  const sexIcon = allData.player?.gender === 1 ? manIcon : womanIcon

  console.log(status, '这是酒局的状态')

  return <BaseLayout>
    {loading ? <Loading /> : <>
      <ScrollView >
        <View className="mx-5">
          <Text className="font-bold my-3">{t('wineDetail.title1')}</Text>
          <View className="bg-[#191919] rounded-2xl text-xs font-light">
            {/* 基础信息 */}
            {allData.infoList.map((info, index) => {

              console.log(t('wineDetail.' + info.value), 't(info.value)');

              return <View key={info.title} >
                <View className="flex flex-row items-center justify-between px-5 py-4">
                  <Text numberOfLines={2} className='w-40'>{info.title}</Text>
                  <Text className="opacity-50 text-right" numberOfLines={5} style={{ flex: 1 }}>{info.key === 'status' ? t('wineDetail.' + info.value) : info.value}</Text>
                </View>
                {index === infoList.length - 1 ? null : <Divider />}
              </View>;
            })}
          </View>
        </View>

        <View className="m-5">
          {/* 参与者信息 */}
          <Text className="font-bold my-3">{t('wineDetail.title2')}</Text>
          <View className="bg-[#191919] rounded-2xl text-xs font-light overflow-hidden">
            {/* 人 */}
            {allData.peopleList.map((people, index) => (<PeoPleItem {...people} index={index} key={people.id} onClickPlayButton={onClickPlayButton} />))}
          </View>
          <View />
        </View>
        {/* 评价酒局 */}
        {(status === STATE.已入场 || status === STATE.已结束) && <Appraise item={res} ref={AppraiseDom} />}
      </ScrollView>

      {!loading && <NavBar />}

      {/* 踢人 */}
      {<Dialog visible={dialog.visible} confirm={confirm} onDismiss={cancel} cancelText={dialog.cancelText} confirmText={dialog.confirmText} dismissable={true}>
        <Text>{dialog.context}</Text>
      </Dialog>}
      {/* 加入 */}
      {<Dialog visible={dialog.visible1} confirm={confirm} onDismiss={cancel} cancelText={dialog.cancelText} confirmText={dialog.confirmText} isShowTitle={false} dismissable={true} >
        <View>
          <Image className='border-2 w-24 h-24 rounded-full border-[#98000CFF]' source={{ uri: allData.player?.avatarUrl }} />
          <View className='flex flex-row  items-center  justify-center relative'>
            <Text className="text-center mt-2 font-bold text-lg mr-2" numberOfLines={2}  >{allData.player?.name}</Text>
            <Image className='w-4 h-4 absolute right-0 bottom-1.5' source={sexIcon} />
          </View>
          <Text className="text-center mt-2  font-bold text-sm">{t('wineDetail.btn10')}</Text>
        </View>
      </Dialog>}

    </>}
    <CheckSex />


    {
      allData.visible && <Portal>

        <MyModal visible={allData.visible} onDismiss={hideModal} contentContainerStyle={containerStyle} dismissable={false} >
          <View>
            <ShareLayer date={res?.entranceDate + '  ' + res?.latestArrivalTime} id={partyId} />
          </View>
          <TouchableOpacity onPress={hideModal} className='flex-row  items-center justify-center mt-10' >
            <Image source={closeIcon} className='w-6 h-6' />
          </TouchableOpacity>
        </MyModal>
      </Portal>
    }
  </BaseLayout >;
};


/* 创建用户如果没有用户用等待加入填充 */
function createPeople(length: number, gender: string, t: any) {
  console.log(length);


  return Array.from({ length: length }, () => {
    return {
      id: uuid.v4(),
      name: t('wineDetail.waiting'),
      gender: gender,
      avatarUrl: undefined,
    };
  });
}

export default FightwineDetail;
