import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';

type Props = {
  min?: number,
  max?: number,
  num?: number,
  onChange?: (num: number) => void,
  onVerify?: (num: number) => boolean,
}


const NumberInput = (props: Props) => {
  const { min = 0, max = 9999999999999, num = 0, onChange, onVerify } = props;
  const [value, selectValue] = useState(num);

  useEffect(() => {
    selectValue(num);
  }, [num]);


  const onMinus = () => {
    onChangeText(`${value - 1}`);
  };

  const onPlus = () => {
    onChangeText(`${value + 1}`);
  };


  const onChangeText = (text: string) => {



    if (/^\d+$/.test(text)) {
      const newText = text.replace(/[^0-9]/g, '');
      const sum = Number(newText);
      if (!onVerify?.(sum)) {
        selectValue(() => {
          let temp = sum > max ? max : sum;
          temp = temp < min ? min : temp;
          onChange?.(temp);
          return temp;
        });
      }

    }

  };





  return <View className="flex-row items-center">
    <IconButton mode="outlined" icon="minus" size={10} containerColor={'#FFFFFF'} iconColor={'#222222FF'} onPress={onMinus} />
    <TextInput mode="outlined" className="bg-transparent text-center w-20 h-[40px]" keyboardType="numeric" value={`${value}`} onChangeText={onChangeText} outlineStyle={{
      borderRadius: 16,
      height: 40,
    }} />
    <IconButton mode="outlined" icon="plus" size={10} containerColor={'#FFFFFF'} iconColor={'#222222FF'} onPress={onPlus} />
  </View>;
};

export default NumberInput;
