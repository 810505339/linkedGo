import { Modal, ModalProps } from "react-native-paper"
import { PropsWithChildren, FC } from 'react'

const MyModal: FC<PropsWithChildren<ModalProps>> = ({ children, ...otherProps }) => {

  return (<Modal {...otherProps} theme={{ colors: { background: 'rgba(51,51,51)' } }} >
    {children}
  </Modal >)
}

export default MyModal
