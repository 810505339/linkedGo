import { FC } from 'react';
import { TextInput } from 'react-native-paper';
import { useImmer } from 'use-immer';
type IInputType = {
  showRight: boolean,
  iconVisible: boolean,
};
type IProps = {
  label: string,
  onChangeText?: (text: string) => void,
  isBg?: boolean
};
const PswInput: FC<IProps> = ({ label, onChangeText, isBg = false, ...pamars }) => {

  const className = isBg ? `bg-transparent text-xl` : `text-xl`

  console.log(className, 'className');

  const [input, setInput] = useImmer<IInputType>({
    showRight: false,
    iconVisible: false,
  });
  const changeInput = (iconVisible: boolean) => {
    setInput((draft: IInputType) => {
      draft.showRight = iconVisible;
      draft.iconVisible = false;
    });
  };
  return (
    <TextInput
      label={label}
      {...pamars}
      secureTextEntry={!input.iconVisible}
      onBlur={() => changeInput(false)}
      onFocus={() => changeInput(true)}
      right={
        input.showRight ? (
          <TextInput.Icon
            onPress={() => {
              setInput((draft: IInputType) => {
                draft.iconVisible = !draft.iconVisible;
              });
            }}
            icon={input.iconVisible ? 'eye-off' : 'eye'}
          />
        ) : null
      }
      onChangeText={onChangeText}
      className={className}
    />
  );
};

export default PswInput;
