
import React, {useEffect} from 'react';
import {View} from 'react-native';
import type {V2TimMessage} from 'react-native-tim-js';

import {TUIChat} from '@TUIKit';



 function DemoChat({route, navigation}: any) {
  const {conversation, userID, unMount, initialMessageList} = route.params;
  useEffect(() => {
    navigation.setOptions({
      title: conversation.showName ?? '',
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: '#EDEDED',
      },
    });
  }, [conversation.showName, navigation]);

  const handleMergeMessageTap = (message: V2TimMessage) => {
    console.log('handleMergeMessageTap', message);
    navigation.navigate('MergerMessageScreen', {
      message,
    });
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TUIChat
        conversation={conversation}
        loginUserID={userID}
        showChatHeader={false}
        unMount={unMount}
        initialMessageList={initialMessageList}
        onMergeMessageTap={handleMergeMessageTap}
      />
    </View>
  );
}


export  default DemoChat;
