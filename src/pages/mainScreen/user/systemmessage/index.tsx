import BaseLayout from '@components/baselayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { UsertackParamList } from '@router/type';
import CustomFlatlist from '@components/custom-flatlist';
import { customerMessage, updateRead } from '@api/user';
import { FC, PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const allIcon = require('@assets/imgs/user/all.png')

export type IItemProps = {
  content: string;
  messageTime: string;
  read: boolean;
  title: string;
  id: string
}

const SystemMessage = () => {

  const navigation = useNavigation<NativeStackNavigationProp<UsertackParamList>>();

  useFocusEffect(
    useCallback(() => {
      flatlist.current!.refreshData();
    }, [])
  );
  const flatlist = useRef();
  const handleItemPress = (id: string) => {
    navigation.navigate('SystemMessageInfo', {
      id: id,
    });
  };
  /* 全部已读 */
  const handleAllRead = async () => {
    const data = await updateRead();

    if (data.success) {
      flatlist.current!.refreshData();
    }

  };

  const HeaderRight = () => {
    const { t } = useTranslation()
    return <TouchableOpacity className='flex flex-row justify-center items-center' onPress={handleAllRead}>
      <Image source={allIcon} className='w-6 h-6' />
      <Button textColor="#ffffff" >
        {t('systemmessage.btn1')}
      </Button>
    </TouchableOpacity>
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight />,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);



  const renderItem: FC<PropsWithChildren<IItemProps>> = (props) => {


    const { content, messageTime, read, title, id } = props;

    const color = !read ? 'text-white' : 'text-[#ffffff7f]'
    return <TouchableWithoutFeedback onPress={() => handleItemPress(id)}>
      <View className="mx-2.5 my-2  py-2.5 pr-2.5 px-6  flex-auto border border-[#2F2F2FBF] rounded-xl bg-[#2020207f] ">
        <View className="flex-row justify-between mb-1 relative pr-3  items-center ">
          <Text className={`${color} text-sm    font-bold`} numberOfLines={1}>{title}</Text>
          <IconButton icon="chevron-right" size={12} iconColor="#ffffff7f" className="absolute -right-4" />
        </View>
        <Text className="text-[#ffffff7f]  text-xs mb-1" numberOfLines={1}>{messageTime}</Text>
        <View className="relative">
          {!read && <View className="w-2 h-2 rounded-full absolute bg-[#EE2737FF] -left-4 top-1" />}
          <Text className="text-[#ffffff7f]  text-xs font-light" numberOfLines={2}>{content}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>;
  };





  return (<BaseLayout>
    <CustomFlatlist keyExtractor={(item) => item.id} renderItem={(item) => renderItem(item)} onFetchData={customerMessage} ref={flatlist} />
  </BaseLayout>);
};

export default SystemMessage;
