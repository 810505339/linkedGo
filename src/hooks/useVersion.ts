import DeviceInfo from "react-native-device-info"
import { Platform, Linking } from 'react-native'
import { useImmer } from 'use-immer'
import { useRequest } from 'ahooks'
import { getVersion } from "@api/version"
import { useEffect } from "react"
import { fileStore } from '@storage/store/getfileurl';
import { getStore } from '@storage/store/versionStore'
import { useNetInfo } from "@react-native-community/netinfo";

export default () => {
  const type = Platform.OS === 'android' ? 'ANDROID' : 'IOS'
  const { isConnected } = useNetInfo();

  const version = DeviceInfo.getVersion()
  const [allData, setAllData] = useImmer({
    versionNumber: '',
    versionIntroduce: '',
    isForceUpdate: 0,
    isShow: false,
    packageFile: '',
    sensitivenessOn: '',//敏感功能开关
    versionType: ''
  })



  const { run, loading } = useRequest(getVersion, {
    manual: true,
    onSuccess: (res) => {

      const resdata = res?.data

      console.log(resdata, '获取版本');

      if (resdata) {

        const isShow = Platform.OS === 'ios'

        setAllData(draft => {
          draft.versionNumber = resdata?.versionNumber
          draft.versionIntroduce = resdata?.versionIntroduce
          draft.isForceUpdate = resdata?.isForceUpdate

          draft.isShow = resdata?.versionNumber != version
          if (isShow) {
            draft.isShow = false
          }
          draft.packageFile = fileStore?.fileUrl + '/' + resdata?.packageFile
          draft.sensitivenessOn = resdata?.sensitivenessOn
          draft.versionType = resdata?.versionType
          getStore(resdata)
        })

      }




    }
  })

  useEffect(() => {
    run({ type, version })
  }, [isConnected])

  function hideDialog() {
    if (allData.isForceUpdate == 1) {
      return
    }
    setAllData(draft => {
      draft.isShow = false
    })
  }
  //下载
  function download() {
    console.log(1);

    Linking.openURL(allData.packageFile)

  }


  return {
    allData,
    hideDialog,
    download,
    loading
  }


}
