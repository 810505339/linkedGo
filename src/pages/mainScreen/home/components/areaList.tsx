import { FC, useEffect } from 'react';
import { View, TouchableOpacity, ImageBackground, useWindowDimensions, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useImmer } from 'use-immer';
import { getAreaById } from '@api/store';
import dayjs from 'dayjs';
import { fileStore } from '@store/getfileurl';
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
];

type IProps = {
  onPress: (index: number) => void
  index: number
  activeIndex: number,
  name: string,
  businessDateVOS: any[],
  pictureFIleVOs: any[],
  id: string
}



const AreaItem = (props: IProps) => {
  const { onPress, index, activeIndex, name, businessDateVOS, pictureFIleVOs } = props;
  const beginTime = businessDateVOS[0].beginTime;
  const endTime = businessDateVOS[0].endTime;

  const border = index === activeIndex ? 'border-2 border-[#E6A055FF]' : 'border-2';
  return (<TouchableOpacity onPress={() => onPress(index)} className='w-[30%] box-border'>
    <View className={`  rounded-xl ${border} overflow-hidden`} >
      <ImageBackground source={{ uri: fileStore.fileUrl + '/' + pictureFIleVOs[0]?.fileName }} className="h-20 " />
    </View>
    <Text className="text-white text-xs font-bold mt-2.5 w-24" numberOfLines={3}>{name}</Text>
    <Text className="opacity-50 text-white mt-1" style={{ fontSize: 10 }}>{beginTime} - {endTime}</Text>
    {/* <Text className="text-[#E6A055FF] text-xs font-bold mt-1">$12.00</Text> */}
  </TouchableOpacity>);
};

export type IAreaListProps = {
  storeId: string,
  date: string,
  onChange: (list: any[], activeIndex: number) => void

}
const AreaList: FC<IAreaListProps> = (props) => {
  const { storeId, date, onChange } = props;

  const { width } = useWindowDimensions()
  const [data, setData] = useImmer({
    cells: [],
    activeIndex: 0,
  });
  const onPress = (index: number) => {
    console.log(index, 'index');

    setData(draft => {
      draft.activeIndex = index;
    });
    onChange(data.cells, index);
  };


  const getAreaByIdApi = async () => {
    const { data: res } = await getAreaById(storeId, { date });
    const week = dayjs(date).day() == 0 ? 7 : dayjs(date).day();
    //获取今天的时间
    //数据里面找到今天的营业

    console.log(week, 'week');
    setData(draft => {
      const list = res ?? [];
      draft.cells = list;
      draft.activeIndex = 0;
      onChange(list, 0);
    });

  };



  useEffect(() => {
    if (storeId && date) {
      getAreaByIdApi();
    }

  }, [storeId, date]);

  return <View className='flex flex-row flex-wrap gap-4'>
    {(data.cells as Array<IProps>).map((item, index) => {
      return <AreaItem {...item} key={item.id} activeIndex={data.activeIndex}
        onPress={onPress} index={index} />
    })}
  </View>

  // return <FlatList
  //   showsHorizontalScrollIndicator={false}
  //   horizontal
  //   data={data.cells}
  //   keyExtractor={item => item.id}
  //   renderItem={({ index, item }) =>
  //     <AreaItem {...(item as IProps)}
  //       index={index}
  //       activeIndex={data.activeIndex}
  //       onPress={onPress} />}
  // />;


};


export default AreaList;

