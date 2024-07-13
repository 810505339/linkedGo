import useUserInfo from "@hooks/useUserInfo";
import { useRequest } from "ahooks";
import { sendSetPayPasswordSmsCode } from "@api/common";
import { useEffect } from "react";

export default (isShowPwd: boolean) => {

  const { userInfoStorage, runAsyncByUser } = useUserInfo();
  const { userInfo } = userInfoStorage;
  console.log(userInfo, 'userInfo');

  const { run } = useRequest(sendSetPayPasswordSmsCode, {
    manual: true
  })



  useEffect(() => {
    console.log(isShowPwd)
    if (isShowPwd) {
      run()
    }
  }, [isShowPwd])



  return {
    phone: userInfo?.phone,
    setPayPassword: userInfo?.setPayPassword ?? false,
    runAsyncByUser
  }
}
