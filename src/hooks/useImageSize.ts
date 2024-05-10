import { useEffect } from "react"
import { Image, useWindowDimensions } from "react-native";
import { useImmer } from "use-immer"

export default () => {
  const window = useWindowDimensions();
  const [imageSize, setData] = useImmer({
    w: 0,
    h: 0,
  })

  function getSize(url: string) {

    Image.getSize(url, (width, height) => {
      setData((draft) => {
        draft.w = window.width * 0.8;
        draft.h = (window.width * height / width) * 0.8;
      })

    });
  }

  return {
    imageSize,
    getSize
  }

}
