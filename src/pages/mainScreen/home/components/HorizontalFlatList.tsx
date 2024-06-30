import { useNavigation } from '@react-navigation/native';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { View, FlatList, ImageBackground, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { RootStackParamList } from '@router/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { cssInterop } from 'nativewind'

import { store } from '@store/versionStore'
import DeviceInfo from 'react-native-device-info';



cssInterop(Text, {
  className: 'style'
})

type IData = {
  [key in string]: string;

}


const Item = ({ navigation, text, source, color, onPress }: IData & {
  onPress: (navigation: string) => void
}) => {
  const { t, i18n } = useTranslation();


  return (
    <TouchableOpacity className="mx-1.5  w-24 h-32  rounded-2xl relative" onPress={() => onPress(navigation)}>
      <ImageBackground source={source as ImageSourcePropType} className="w-full h-full text-center" />
      <Text className="text-xs   absolute bottom-2 text-center w-full" style={{ color: color }}>{t(text)}</Text>
    </TouchableOpacity>
  );
};


type IProps = {
  style?: any,
  className?: string
}

const HorizontalFlatList: FC<PropsWithChildren<IProps>> = ({ style }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const version = DeviceInfo.getVersion()
  const [data, setData] = useState<IData[]>([

    { key: '1', navigation: 'Fightwine', text: 'home.nav1', source: require('@assets/imgs/home/fightwine.png'), color: '#ED8EFFFF' },
    { key: '4', navigation: 'Radio', text: 'home.nav4', source: require('@assets/imgs/home/radio.png'), color: '#FF8383FF' },
    { key: '6', navigation: 'Dynamic', text: 'home.nav6', source: require('@assets/imgs/home/dynamic.png'), color: '#C7C2FFFF' },

  ])


  useEffect(() => {
    if (store.app.versionNumber) {

      if (store.app.sensitivenessOn === '0' || version != store.app.versionNumber) {
        setData([
          { key: '1', navigation: 'Fightwine', text: 'home.nav1', source: require('@assets/imgs/home/fightwine.png'), color: '#ED8EFFFF' },
          { key: '2', navigation: 'Preset', text: 'home.nav2', source: require('@assets/imgs/home/tickets.png'), color: '#FFBF65FF' },
          { key: '3', navigation: 'ReserveBooth', text: 'home.nav3', source: require('@assets/imgs/home/deck.png'), color: '#91F2FFFF' },
          { key: '4', navigation: 'Radio', text: 'home.nav4', source: require('@assets/imgs/home/radio.png'), color: '#FF8383FF' },
          { key: '6', navigation: 'Dynamic', text: 'home.nav6', source: require('@assets/imgs/home/dynamic.png'), color: '#C7C2FFFF' },
        ])

      }
    }


  }, [store.app])



  const onPress = (nav: any) => {
    navigation.navigate(nav);
  };

  return (
    <View style={style} >
      <FlatList
        data={data}
        renderItem={({ item }) => <Item  {...item} onPress={onPress} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

export default HorizontalFlatList;
