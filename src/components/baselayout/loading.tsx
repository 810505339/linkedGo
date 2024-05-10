import { Button, Modal, Portal, Text } from 'react-native-paper';

const Loading = () => {
  return (<Portal>
    <Modal visible={true} dismissable={false}>
      <Button loading className="text-2xl">loading</Button>
    </Modal>
  </Portal>);
};


export default Loading;
