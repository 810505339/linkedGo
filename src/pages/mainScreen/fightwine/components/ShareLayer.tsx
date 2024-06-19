import { CreateModalOptions } from 'react-native-modal-layer'
import { Easing, Image, ImageBackground, View } from 'react-native'
import { ScreenWidth } from '@rneui/base'
import QRCode from 'react-native-qrcode-svg'

const imageSize = Image.resolveAssetSource(require('../images/share_bg_zh.png'))

const IMAGE_WIDTH = 1920,
    IMAGE_HEIGHT = 2880
const QrCodeSize = 445,
    QrRight = 407,
    QrBottom = 270

export default function ShareLayer({ id }: { id: string }) {
    const width = ScreenWidth - 40
    const height = (imageSize.height * width) / imageSize.width
    const qrsize = (QrCodeSize * width) / IMAGE_WIDTH
    const right = (QrRight * width) / IMAGE_WIDTH
    const bottom = (QrBottom * height) / IMAGE_HEIGHT
    return (
        <ImageBackground
            style={{
                width: width,
                height: height,
            }}
            source={require('../images/share_bg_zh.png')}
        >
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
