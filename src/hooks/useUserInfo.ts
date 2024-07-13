import storage from '@storage/index';
import { useEffect, useState } from 'react';
import { IM_KEY } from '@storage/shop/key';
import { resetGenericPassword } from 'react-native-keychain';
import { useRequest } from 'ahooks';
import { detailsById } from '@api/user';
export default () => {
  const [userInfoStorage, setuserInfoStorage] = useState<any>({});


  const { runAsync, loading } = useRequest(detailsById, {
    manual: true,
    onSuccess: (res) => {

      console.log(res?.data,)
      save(res?.data)

    }
  });

  async function save(user: any) {
    await storage.save({
      key: IM_KEY,
      data: {
        userId: userInfoStorage?.user_id,
        userSig: userInfoStorage?.user_info?.userSig,
        userInfo: user,
      },
    });
  }
  useEffect(() => {


    (async () => {

      const _userInfoStorage = await storage.load({ key: IM_KEY }).catch(err => {
        console.log("123123123131")
      })

      console.log(_userInfoStorage, "_userInfoStorage")
      if (!_userInfoStorage) {
        resetGenericPassword()
      }
      setuserInfoStorage(_userInfoStorage ?? {});
    })();
  }, [loading]);

  return {
    userInfoStorage,
    save,
    runAsyncByUser: runAsync
  };
};
