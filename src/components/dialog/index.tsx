import { ReactNode, PropsWithChildren } from 'react';
import { Image, View } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { cssInterop } from 'nativewind';
import { useTranslation } from 'react-i18next';
import MyModal from '@components/modal';
const headerIcon = require('@assets/imgs/base/modalHeader.png');


type IProps = {
  visible: boolean /* 是否显示弹窗 */
  confirm: () => void /* 点击确定按钮 */
  onDismiss: () => void /* 点击取消 */
  onCancel?: () => void /* 点击遮罩 */
  title?: ReactNode,
  confirmText?: string,
  cancelText?: string,
  isShowTitle?: boolean,
  dismissable?: boolean /* 是否可以点击空白处关闭弹窗 */
}

const Dialog = (props: PropsWithChildren<IProps>) => {
  const { t } = useTranslation()
  const { visible, confirm, onDismiss, title, children, confirmText, cancelText, isShowTitle = true, dismissable = false, onCancel } = props;
  const _title = title ? title : <Text>{t('Modal.tip')}</Text>;
  const _confirmText = confirmText ?? t('common.btn2');
  const _cancelText = cancelText ?? t('common.btn6');
  return <Portal>
    <MyModal visible={visible} dismissable={dismissable} onDismiss={onCancel} >
      <View className="w-[285]  bg-[#222222FF] items-center  ml-auto mr-auto rounded-2xl relative ">
        <Image source={headerIcon} resizeMode="contain" className="w-[285] h-[60] absolute -top-2 left-0 right-0" />
        <View>
          {isShowTitle ? _title : null}
        </View>
        <View className="ml-auto mr-auto py-8 px-5">
          {children}
        </View>
        <View className="flex-row justify-around items-center  w-full px-5 pb-5 ">
          <Button className="bg-transparent  w-36 mr-5" mode="outlined" labelStyle={{ fontWeight: 'bold' }} textColor="#ffffffbf" onPress={onDismiss} >{_cancelText}</Button>
          <Button className="bg-[#EE2737FF] w-36 " textColor="#000000FF" labelStyle={{ fontWeight: 'bold' }} mode="contained" onPress={confirm} >{_confirmText}</Button>
        </View>
      </View>
    </MyModal>
  </Portal>;
};

export default Dialog;
