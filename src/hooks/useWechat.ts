import { mediaLogin } from '@api/login'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useRequest } from 'ahooks'

import { IM_KEY } from '@storage/shop/key'
import {
    isWXAppInstalled,
    registerApp,
    sendAuthRequest,
} from 'react-native-wechat-lib'
import { RootStackParamList } from 'router/type'
import useLogin from '@pages/LoginScreen/hooks/useLogin'
import { setGenericPassword } from 'react-native-keychain'
import storage from '@storage/index'
import { NativeModules } from 'react-native'
import Toast from 'react-native-toast-message'
export default (nav: NativeStackNavigationProp<RootStackParamList>) => {
    const { handleLogin, handleLoginOut } = useLogin({}, nav)

    const { run } = useRequest(mediaLogin, {
        manual: true,
        onSuccess: async (res) => {
            console.log(res.data, 'res')
            Toast.show({
                text1: '成功了！~'
            })
            const data = res.data
            if ('needAuth' in data) {
                if (data.needAuth) {
                    nav.navigate('LoginOrRegister', {
                        authCode: data?.authCode,
                    })
                } else {
                    console.log(data, '这是微信登录返回的东西哦')


                    await setGenericPassword(data?.sub, data?.access_token)
                    await storage.save({
                        key: IM_KEY,
                        data: {
                            userId: data?.user_id,
                            userSig: data?.user_info?.userSig,
                            userInfo: data?.user_info,
                        },
                    })
                    handleLoginOut(data)
                }
            }
        },
        onError: (err) => {
            console.log(err)
            Toast.show({
                text1: '失败了~~'
            })
        },
    })

    async function wechatLogin() {
        /* 注册微信api */
        await registerApp(/*  */
            'wx8d956651a112bfa6',
            'https://m.point2club.com/WechatLogin/'
        )
        /* 判断是否安装微信 */
        const isInstall = isWXAppInstalled()
        if (isInstall) {
            const res = await sendAuthRequest('snsapi_userinfo', '')
            console.log(res.code)
            Toast.show({
                text1: res.code
            })

            if (res.code) {
                run('WX_APP', res.code)
            }

            console.log('微信已安装')
        } else {
            console.log('微信未安装')
            return false
        }
        console.log(isInstall)
    }

    async function iosWxLogin() {
        const { WxLogin } = NativeModules
        WxLogin.login('这是名称', '这是location')
    }

    return {
        wechatLogin, // 导出函数
        iosWxLogin,
    }
}
