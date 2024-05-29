import { useNavigation } from '@react-navigation/native'
import { Image, Platform, TouchableOpacity, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { RootStackParamList } from '@router/type'
import BaseLayout from '@components/baselayout'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import useWechat from '@hooks/useWechat'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import {  useStore } from '@store/versionStore'

const bgImage = require('@assets/imgs/login/bg.png')

const closeIcon = require('@assets/imgs/base/close.png')

const Login = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const { wechatLogin, iosWxLogin } = useWechat(navigation)
    const { t } = useTranslation()
    const loginList = [
        { img: require('@assets/imgs/login/wechat.png'), name: 'WeChat' },
    ]



    const { sensitiveness } = useStore()

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Image source={closeIcon} className="w-6 h-6 mr-4" />
            ),
        })
    }, [navigation])



    function handleLogin() {
        navigation.navigate('LoginOrRegister', {})
    }

    async function mediaClick(item: any) {
        if (item.name === 'WeChat') {
            if (Platform.OS === 'ios') {
                await wechatLogin()
            } else {
                await wechatLogin()
            }
        }
        // navigation.navigate(item.name)
    }

    return (
        <BaseLayout source={bgImage}>
            <View className="absolute left-16 right-16 bottom-0 h-64">
                <Button
                    mode="outlined"
                    style={{
                        borderColor: '#EE2737',
                        height: 50,
                        borderRadius: 33,
                    }}
                    labelStyle={{
                        fontSize: 18,
                        color: '#EE2737',
                        fontWeight: '600',
                    }}
                    contentStyle={{ height: 50 }}
                    onPress={handleLogin}
                >
                    {t('login.btn4')}
                </Button>

                {sensitiveness &&
                    <View>
                        <View className="flex-row items-center justify-center">
                            <View className="m-auto   mt-8  flex-row items-center justify-between">
                                <View className="w-8 h-0 border-t border-[#ffffff7f]  " />
                                <Text className="text-xs text-[#ffffff7f] mx-2">
                                    {t('login.btn11')}
                                </Text>
                                <View className="w-8 h-0 border-t border-[#ffffff7f]" />
                            </View>
                        </View>

                        <View className="mt-2 px-10 flex-row items-center justify-center">
                            {loginList.map((l, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => mediaClick(l)}
                                    >
                                        <Image
                                            source={l.img}
                                            className="w-[24px] h-[24px]"
                                        />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                }


            </View>
        </BaseLayout>
    )
}

export default Login
