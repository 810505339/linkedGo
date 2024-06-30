import { FC, useEffect } from 'react';
import { View, TouchableOpacity, ImageBackground, useWindowDimensions, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useImmer } from 'use-immer';
import { getAreaById } from '@api/store';
import dayjs from 'dayjs';
import { fileStore } from '@store/getfileurl';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
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
  changeLoading?: (loading: boolean) => void

}
const AreaList: FC<IAreaListProps> = (props) => {
  const { storeId, date, onChange, changeLoading } = props;
  const { t } = useTranslation()

  const { runAsync, loading } = useRequest(() => getAreaById(storeId, { date }), {
    manual: true
  })
  const [data, setData] = useImmer({
    cells: [],
    activeIndex: 0,
  });
  const onPress = (index: number) => {
    console.log(index, 'index');

    setData(draft => {
      draft.activeIndex = index;
    });
    //onChange(data.cells, index);
  };


  const getAreaByIdApi = async () => {
    const { data: res } = await runAsync()
    setData(draft => {
      const list = res ?? [];
      draft.cells = list;
      draft.activeIndex = 0;

    });
  };

  useEffect(() => {
    onChange(data.cells, data.activeIndex)
  }, [data.activeIndex, data.cells])



  useEffect(() => {
    if (storeId && date) {
      getAreaByIdApi();
    }

  }, [storeId, date]);

  useEffect(() => {
    changeLoading?.(loading)
  }, [loading])

  if (loading) {
    return null
  }
  if (data.cells.length <= 0) {
    return <View className='border border-[#343434] bg-[#191919] h-24 rounded-xl justify-center items-center flex-row'>
      <Text className='text-xs  opacity-50 ml-2.5'>{t('NoMore.tag2')}</Text>
    </View>
  }

  return <View className='flex flex-row flex-wrap gap-4'>
    {(data.cells as Array<IProps>).map((item, index) => {
      return <AreaItem {...item} key={item.id} activeIndex={data.activeIndex}
        onPress={onPress} index={index} />
    })}
  </View>

};


export default AreaList;

