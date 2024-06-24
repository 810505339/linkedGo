import { CreateModalOptions } from 'react-native-modal-layer'
import { Easing, Image, ImageBackground, TouchableOpacity, View } from 'react-native'
import { ScreenWidth } from '@rneui/base'
import QRCode from 'react-native-qrcode-svg'
import { Button, Text } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import ViewShot from 'react-native-view-shot'
import { useRef } from 'react'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import Toast from 'react-native-toast-message'

const imageSize = Image.resolveAssetSource(require('../images/share_bg_zh.png'))

const IMAGE_WIDTH = 1920,
    IMAGE_HEIGHT = 2880
const QrCodeSize = 445,
    QrRight = 407,
    QrBottom = 270

const
    dateRight = 180,
    dateBottom = 1060

export default function ShareLayer({ id, date }: { id: string, date: string }) {
    const width = ScreenWidth - 80
    const height = (imageSize.height * width) / imageSize.width
    const qrsize = (QrCodeSize * width) / IMAGE_WIDTH
    const right = (QrRight * width) / IMAGE_WIDTH
    const dateright = (dateRight * width) / IMAGE_WIDTH
    const bottom = (QrBottom * height) / IMAGE_HEIGHT
    const datebottom = (dateBottom * height) / IMAGE_HEIGHT
    const { t } = useTranslation()
    const domRef = useRef(null)

    function save() {
        domRef.current.capture().then(uri => {
            CameraRoll.save(uri)
            Toast.show({
                text1: t('common.save')
            })
        });
    }

    return (
        <View>
            <ViewShot ref={domRef} options={{ fileName: "fightwine", format: "png", quality: 1 }}>
                <ImageBackground
                    style={{
                        width: width,
                        height: height,
                    }}
                    source={require('../images/share_bg_zh.png')}
                >
                    <View style={{ position: 'absolute', right: dateright, bottom: datebottom }}>
                        <Text className='  font-bold text-[#000]'>{date}</Text>
                    </View>
                    <View style={{ position: 'absolute', right, bottom }}>
                        <QRCode
                            size={qrsize}
                            value={`https://m.point2club.com#/drinking-party/${id}`}
                        />
                    </View>
                </ImageBackground>
            </ViewShot>

            <View className='flex  items-center justify-center my-10'>
                <Button mode={'elevated'} className="bg-[#EE2737FF]  font-bold  w-40 " contentStyle={{ padding: 0 }}

                    onPress={save}

                    textColor="#000000FF"

                >{t('ticket.bnt4')}</Button>
            </View>



        </View>
    )
}

const options: CreateModalOptions = {
    hideEasing: Easing.linear,
}

ShareLayer.modalLayerOptions = options
