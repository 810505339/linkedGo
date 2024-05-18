import { useEffect } from 'react'
import useUserInfo from './useUserInfo';
import { TencentImSDKPlugin, V2TimConversationListener } from 'react-native-tim-js';
import Toast from 'react-native-toast-message';
import { loadLanguageStorage } from '@storage/language/action';


export default () => {
  const { userInfoStorage } = useUserInfo();

  const { userId, userSig, userInfo } = userInfoStorage;

  async function ImLogin() {

    console.log('添加了imHooks的');

    const { language } = await loadLanguageStorage();



    if (userId && userSig) {
      const loginRes = await TencentImSDKPlugin.v2TIMManager.login(userId, userSig);
      if (loginRes.code == 0) {
        console.log('登录成功');
        //设置会话监听器
        const listener: V2TimConversationListener = {
          onSyncServerStart: () => {
            //同步服务器会话开始
          },
          onSyncServerFinish: () => {
            //同步服务器会话完成
          },
          onSyncServerFailed: () => {
            // 同步服务器会话失败
          },
          onNewConversation: async (conversationList) => {

            //conversationList 变更会话列表
            const conversationIndex = conversationList.findIndex(item => item.userID === 'administrator')
            if (~conversationIndex) {
              const getConversationtRes = await TencentImSDKPlugin.v2TIMManager
                .getConversationManager()
                .getConversation('C2C_administrator')
              console.log(getConversationtRes, 'onNewConversation');
            }

          },
          onTotalUnreadMessageCountChanged: (totalUnreadCount) => {
            //会话未读总数变更通知
            //totalUnreadCount 会话未读总数
            console.log(totalUnreadCount, 'totalUnreadCount');
          },
          onConversationChanged: async (conversationList) => {
            //某些会话的关键信息发生变化
            //conversationList 变更会话列表
            const conversationIndex = conversationList.findIndex(item => item.userID === 'administrator')
            if (~conversationIndex) {

              const getConversationtRes = await TencentImSDKPlugin.v2TIMManager
                .getConversationManager()
                .getConversation(`c2c_${conversationList[conversationIndex].userID}`)
              const text = JSON.parse(getConversationtRes.data?.lastMessage?.textElem?.text ?? '{}')
              let text1 = ''
              if (language === 'zh') {
                text1 = text?.contentZH
              }
              if (language === 'en') {
                text1 = text?.contentEN
              }

              console.log(getConversationtRes.data?.lastMessage?.textElem?.text, 'getConversationtRes.data?.lastMessage?.textElem?.text')
              Toast.show({
                type: "info",
                text1: text1
              })

            }


          },
          onConversationGroupCreated(groupName, conversationList) {
            //会话分组被创建
          },
          onConversationGroupDeleted(groupName) {
            //会话分组被删除
          },
          onConversationGroupNameChanged(oldName, newName) {
            //会话分组名变更
          },
          onConversationsAddedToGroup(groupName, conversationList) {
            //会话分组新增会话
          },
          onConversationsDeletedFromGroup(groupName, conversationList) {
            //会话分组删除会话
          },
        };
        //添加群组监听器
        TencentImSDKPlugin.v2TIMManager
          .getConversationManager()
          .addConversationListener(listener);

      }
    }
  }

  useEffect(() => {
    if (userSig && userId) { ImLogin() }
  }, [userInfoStorage])
  return {
    ImLogin,

  }

}
