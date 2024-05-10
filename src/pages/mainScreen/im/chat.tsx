
import React, { useEffect } from 'react';
import { View } from 'react-native';
import type { V2TimMessage } from 'react-native-tim-js';

import { TUIChat } from '@TUIKit/components/TUIChat/index';
import BaseLayout from '@components/baselayout';

// type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

function ChatScreen({ route, navigation }: any) {
  const { conversation, userID, unMount, initialMessageList } = route.params;

  console.log(userID, 'userID');

  useEffect(() => {
    navigation.setOptions({
      title: conversation.showName ?? '',
      headerBackTitleVisible: true,
    });
  }, [conversation.showName, navigation]);

  const handleMergeMessageTap = (message: V2TimMessage) => {
    console.log('handleMergeMessageTap', message);
    navigation.navigate('MergerMessageScreen', {
      message,
    });
  };

  return (
    <BaseLayout >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
        <TUIChat
          conversation={conversation}
          loginUserID={userID}
          showChatHeader={false}
          unMount={unMount}
          initialMessageList={initialMessageList}
          onMergeMessageTap={handleMergeMessageTap}
        />
      </View>

    </BaseLayout>
  );
}


export default ChatScreen;
