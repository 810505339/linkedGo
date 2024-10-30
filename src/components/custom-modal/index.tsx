import Drawer from '@components/drawer';
import { FC, forwardRef, useCallback, useEffect, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetFooter, BottomSheetModal, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, RadioButton, Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { cssInterop } from 'nativewind'
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(FastImage, {
  className: 'style'
})

cssInterop(Text, {
  className: 'style'
})
const headerIcon = require('@assets/imgs/base/header.png');


export type IItemProp = {
  name: string,
  id: string,
}

const Item: FC<IItemProp> = (props) => {
  const { name, id } = props;
  return <View className="mx-5 px-2.5  rounded-xl  flex flex-row items-center border border-[#2D2424] justify-between h-10 mb-4 bg-[#221F1F80]">
    <Text className="text-white text-sm font-bold" >{name}</Text>
    <RadioButton.Android value={id} color="#EE2737FF" />
  </View>;
};

const ListHeaderComponent: FC<{ headerText?: string }> = ({ headerText = '标 题' }) => {
  return <View className="relative h-20 w-full">
    <FastImage
      className="absolute h-full w-full inset-0 -z-10"
      source={headerIcon}
      resizeMode={FastImage.resizeMode.cover}
    />
    <View className="h-full flex items-center">
      <View className="rounded w-10 h-1  mt-2 bg-[#0B0B0B]" />
      <View className="h-12 justify-center">
        <Text className="text-lg font-bold " style={{ color: '#fff' }} >{headerText}</Text>
      </View >
    </View >
  </View >;
};

const ListFooterComponent: FC<{ btnText?: string, onPress: () => void }> = ({ btnText = '确定', onPress }) => {
  return <View className="p-5">
    <Button
      mode="outlined"
      style={{ borderColor: '#EE2737', backgroundColor: '#EE2737', height: 50, borderRadius: 33 }}
      labelStyle={{
        fontSize: 18,
        color: '#0C0C0CFF',
        fontWeight: '600',
      }}
      contentStyle={{ height: 50 }}
      onPress={onPress}
    >
      {btnText}
    </Button>
  </View>;
};


export type IModalProp = {
  btnText?: string;
  headerText?: string;
  data: IItemProp[],
  onPress: (value: IItemProp | undefined) => void,
  selectValue: string,
  snapPoints: string[]
}



const CustomModal = forwardRef<BottomSheetModal, IModalProp>((props, ref) => {
  const { btnText, headerText, data, onPress, selectValue, snapPoints } = props;
  const [value, setValue] = useState<string>('123');
  useEffect(() => {
    console.log(selectValue)
    setValue(selectValue);
  }, [selectValue]);
  function onDismiss() {
    setValue(selectValue);
  }

  // renders
  const renderFooter = useCallback(
    () => {
      return (
        <ListFooterComponent btnText={btnText} onPress={() => onPress(data?.find(d => d.id == value))} />
      );
    },
    [btnText, data, onPress, value]
  );

  const onValueChange = (value: any) => {

    setValue(value)
    onPress(data?.find(d => d.id == value))
  }




  const renderItem = useCallback(
    (item) => (

      <RadioButton.Item key={item.id}
        mode={'android'}
        label={item.name}
        color={'#EE2737'}
        labelStyle={{ color: '#ffffff' }}
        style={{ borderRadius: 12, borderWidth: 1, borderColor: '#2D2424', padding: 20, margin: 10, backgroundColor: '#221f1f7f' }} //#2D2424
        value={item.id} />
    ),
    []
  );


  return <Drawer snapPoints={snapPoints} ref={ref} onDismiss={onDismiss}  >
    <BottomSheetView >
      <ListHeaderComponent headerText={headerText} />
    </BottomSheetView>
   <BottomSheetScrollView>
      <RadioButton.Group onValueChange={onValueChange} value={value}>
        {data.map(renderItem)}
      </RadioButton.Group>
    </BottomSheetScrollView>
    {/* <BottomSheetView >
      {renderFooter()}
    </BottomSheetView> */}
  </Drawer>;
});



export default CustomModal;

