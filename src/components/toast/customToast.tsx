import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

/*
  1. Create the config
*/
const toastConfig: ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <View
      className="  bg-slate-800   bottom-0 py-2 px-4 rounded-3xl"
    >
      <Text className="text-center text-sm">{props.text1}</Text>
    </View>
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  info: (props) => (
    <View
      className=" h-20 bg-red-500 py-2 px-4  items-center justify-center"
    >
      <Text className="text-center text-sm">{props.text1}</Text>
    </View>
  )

  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */

};


export default toastConfig;
