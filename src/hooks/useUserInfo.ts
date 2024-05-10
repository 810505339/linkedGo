import storage from '@storage/index';
import { useEffect, useState } from 'react';
import { IM_KEY } from '@storage/shop/key';
import { resetGenericPassword } from 'react-native-keychain';
export default () => {
  const [userInfoStorage, setuserInfoStorage] = useState<any>({});

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
      const _userInfoStorage = await storage.load({ key: IM_KEY });
      if (!_userInfoStorage) {
        resetGenericPassword()
      }
      setuserInfoStorage(_userInfoStorage);
    })();
  }, []);

  return {
    userInfoStorage,
    save,
  };
};
