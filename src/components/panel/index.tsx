import { ImageBackground, View } from 'react-native';
import { FC, PropsWithChildren } from 'react';

const headerBg = require('@assets/imgs/home/preset/header.png');
type IProps = {
  className?: string
}
const Panel: FC<PropsWithChildren<IProps>> = (props) => {
  const { className } = props;
  return (<View className={`bg-[#101010FF] rounded-t-2xl ${className}`}>
    <View className="h-20 w-full broder-red-500 absolute">
      <ImageBackground source={headerBg} resizeMode="stretch" className="absolute left-0 right-0 bottom-0 top-0" />
    </View>
    <View className="p-5" >{props.children}</View>

  </View>);
};


export default Panel;
