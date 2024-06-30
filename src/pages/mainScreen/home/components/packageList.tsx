import { FC, useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useImmer } from 'use-immer';
import { fileStore } from '@store/getfileurl';
import { useRequest } from 'ahooks';
import { getByBoothId } from '@api/booths';
import uuid from 'react-native-uuid';
import { useTranslation } from 'react-i18next';
type IProps = {
  onPress: (index: number) => void
  index: number
  activeIndex: number,
  name: string,
  pictureFileVOs: any[],
  introduction: string
}
const img = require('@assets/imgs/base/booth_card.png');




const PackageItem = (props: IProps) => {
  const { onPress, index, activeIndex, name, pictureFileVOs, introduction } = props;
  console.log(pictureFileVOs, 'pictureFIleVOs');
  const source = pictureFileVOs ? { uri: fileStore.fileUrl + '/' + pictureFileVOs[0]?.fileName } : img;

  const border = index === activeIndex ? 'border-2 border-[#E6A055FF]' : 'border-2';
  return (<TouchableOpacity onPress={() => onPress(index)} className='w-[30%] '>
    <View >
      <Image resizeMode="cover" source={source} className={`${border}  h-[70px] rounded-2xl`} />
      <Text className="text-white text-xs font-bold mt-2.5 my-2 truncate w-24  " numberOfLines={2}>{name}</Text>
      <Text className="opacity-50 text-white  w-24" style={{ fontSize: 10 }} numberOfLines={6} >{introduction}</Text>
    </View>
  </TouchableOpacity>);
};

export type IAreaListProps = {
  boothId: string,
  onChange?: (list: any[], index: number | undefined) => void
  changeLoading?: (loading: boolean) => void
}

const PackageList: FC<IAreaListProps> = (props) => {

  const { t } = useTranslation();

  const initList = [
    {
      id: uuid.v4(),
      name: t('confirmBooth.label3'),
      introduction: t('confirmBooth.label4'),
      isDefault: true,
    },
  ];/*  */
  const { boothId, onChange, changeLoading } = props;
  const [data, setData] = useImmer({
    cells: initList,
    activeIndex: 0,
  });
  const onPress = (index: number) => {
    setData(draft => {
      draft.activeIndex = index;
    });
    // onChange?.(data.cells, index);
  };

  const { run, loading } = useRequest(() => getByBoothId(boothId), {
    manual: true,
    onSuccess: (res) => {



      setData(draft => {
        draft.cells = res.data ? [...initList, ...res.data,] : initList;
        // onChange?.(draft.cells, 0);
        draft.activeIndex = 0;
      });



    },
  });

  useEffect(() => {
    if (boothId) {
      run();
    }
  }, [boothId]);

  useEffect(() => {
    changeLoading?.(loading)
  }, [loading])

  useEffect(() => {
    onChange?.(data.cells, data.activeIndex);
  }, [data])

  return (<View className=' flex-wrap gap-3 flex-row '>
    {data.cells.map((item, index) => {
      return <PackageItem {...item} key={index} index={index} activeIndex={data.activeIndex} onPress={onPress} />
    })}

  </View>)
  // return <Animated.FlatList horizontal showsHorizontalScrollIndicator={false} data={data.cells} keyExtractor={item => item.id} renderItem={({ index, item }) => <PackageItem {...item} index={index} activeIndex={data.activeIndex} onPress={onPress} />} />;

};

export default PackageList;

