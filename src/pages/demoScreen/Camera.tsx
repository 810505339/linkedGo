import { useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Camera, CameraPosition, useCameraDevice } from 'react-native-vision-camera';

const DemoCamera = () => {
  console.log('渲染了DemoCamera');
  
  const [cameraPosition, setcameraPosition] = useState<CameraPosition>('back');
  //front
  const device = useCameraDevice(cameraPosition);
  const camera = useRef<Camera>(null);
  const dimensions = useWindowDimensions();
  return <View>
    {device && <Camera
      ref={camera}
      style={{  width: dimensions.width, height: dimensions.height }}

      //https://github.com/mrousavy/react-native-vision-camera/issues/1988  不然会崩溃

      key={device.id}
      device={device} //此相机设备包含的物理设备类型列表。
      // video={true} //录像功能打开关闭
      // supportsVideoHDR={true}
      photo={true} //拍照功能是否打开
      isActive={true}
      resizeMode="contain"

    />}
  </View>;
};

export default DemoCamera;
