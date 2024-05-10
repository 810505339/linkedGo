import { Appbar } from 'react-native-paper';
import { getHeaderTitle, getDefaultHeaderHeight } from '@react-navigation/elements';
import { View, TouchableOpacity, Image, Text } from 'react-native';

import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackHeaderProps } from '@react-navigation/stack';
import { cssInterop } from 'nativewind';

cssInterop(Image, {
  className: 'style',
})



const white = require('@assets/imgs/nav/white.png')

export default function CustomNavigationBar(props: StackHeaderProps) {
  const { navigation,
    route,
    options,
    back, } = props




  const title = getHeaderTitle(options, route.name);
  const Right = options.headerRight || (() => null);
  const Left = options.headerLeft

  const insets = useSafeAreaInsets();
  const style = options.headerStyle ?? { backgroundColor: 'transparent' };

  navigation.goBack
  return (
    <View>
      <Appbar.Header
        style={style}>

        {back ? (
          <TouchableOpacity onPress={navigation.goBack} className='ml-5'>
            {Left ? <Left /> : <Image source={white} className='w-6 h-6 mr-4' />}
          </TouchableOpacity>
        ) : null}
        <Appbar.Content titleStyle={{ fontSize: 17, fontWeight: 'bold', color: '#fff' }} title={title} style={{
          alignItems: 'flex-start',
          justifyContent: "center",
        }} />
        <Right />
      </Appbar.Header>
    </View>
  );
}
