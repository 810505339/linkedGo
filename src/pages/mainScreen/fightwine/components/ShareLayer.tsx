import { CreateModalOptions } from 'react-native-modal-layer'
import { Easing, Image, ImageBackground, View } from 'react-native'
import { ScreenWidth } from '@rneui/base'
import QRCode from 'react-native-qrcode-svg'
import { Text } from 'react-native-paper'

const imageSize = Image.resolveAssetSource(require('../images/share_bg_zh.png'))

const IMAGE_WIDTH = 1920,
    IMAGE_HEIGHT = 2880
const QrCodeSize = 445,
    QrRight = 407,
    QrBottom = 270

const
    dateRight = 260,
    dateBottom = 1060

export default function ShareLayer({ id, date }: { id: string, date: string }) {
    const width = ScreenWidth - 40
    const height = (imageSize.height * width) / imageSize.width
    const qrsize = (QrCodeSize * width) / IMAGE_WIDTH
    const right = (QrRight * width) / IMAGE_WIDTH
    const dateright = (dateRight * width) / IMAGE_WIDTH
    const bottom = (QrBottom * height) / IMAGE_HEIGHT
    const datebottom = (dateBottom * height) / IMAGE_HEIGHT

    return (
        <ImageBackground
            style={{
                width: width,
                height: height,
            }}
            source={require('../images/share_bg_zh.png')}
        >
            <View style={{ position: 'absolute', right: dateright, bottom: datebottom }}>
                <Text className='  font-bold'>{date}</Text>
            </View>
            <View style={{ position: 'absolute', right, bottom }}>
                <QRCode
                    size={qrsize}
                    value={`https://m.point2club.com#/drinking-party/${id}`}
                />
            </View>
        </ImageBackground>
    )
}

const options: CreateModalOptions = {
    hideEasing: Easing.linear,
}

ShareLayer.modalLayerOptions = options
