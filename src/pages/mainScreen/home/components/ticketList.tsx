import { FC, useEffect } from 'react';
import { View, TouchableOpacity, ImageBackground, useWindowDimensions, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
type IProps = {
  onPress: (index: number) => void
  index: number
  activeIndex: number,
  ticketName: string,
  ticketPicture: string,
  id: string
  amount: string
}



const Item = (props: IProps) => {
  console.log(props);

  const { onPress, index, activeIndex, ticketName, ticketPicture, amount } = props;


  const border = index === activeIndex ? 'border-2 border-[#E6A055FF]' : 'border-2';
  return (<TouchableOpacity onPress={() => onPress(index)} className='w-[30%]'>
    <View className={` h-[61px] rounded-xl ${border} overflow-hidden`} >
      <ImageBackground source={{ uri: ticketPicture }} className="w-[99px] h-[61px]" />
    </View>
    <Text className="text-white text-xs font-bold mt-2.5 w-24" numberOfLines={3}>{ticketName}</Text>
    <Text className="text-[#E6A055FF] text-xs font-bold mt-1">S${amount}</Text>
  </TouchableOpacity>);
};


type ITicketList = {
  list: any
  onPress: () => void
  activeIndex: number
}

const TicketList = (props: ITicketList) => {
  const { list, onPress, activeIndex } = props

  console.log('渲染的门票list', list);

  return <View className='flex flex-row gap-5'>
    {
      list.map((item: any, index: number) => {
        return <Item index={index} {...item} activeIndex={activeIndex} onPress={onPress} />
      })

    }
  </View>


  // return <FlatList
  //   horizontal
  //   data={list}
  //   keyExtractor={item => item.ticketDetailId}
  //   renderItem={({ index, item }) => <Item index={index} {...item} activeIndex={activeIndex} onPress={onPress} />}
  // />;

};


export default TicketList;

