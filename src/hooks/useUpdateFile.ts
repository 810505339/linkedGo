import { updateFile } from '@api/common';
import { useState } from 'react';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { Image, useWindowDimensions } from 'react-native';


export type IUpdateImage = {
  id: string
  previewUrl: string
  width: number
  height: number
}

const useUpdateFile = (option?: ImageLibraryOptions) => {
  const window = useWindowDimensions();





  const [imageList, setImageList] = useState<Array<IUpdateImage>>([]);
  console.log('传入的option.selectionLimit', option?.selectionLimit);

  let optionValue: ImageLibraryOptions = option || {
    mediaType: 'photo',
    maxWidth: 600,// 设置选择照片的大小，设置小的话会相应的进行压缩
    maxHeight: 600,
    quality: 0.8,
    selectionLimit: 1,
  };
  //选择头像
  async function handleChooseImage() {
    const response = await launchImageLibrary(optionValue);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      if (response.assets) {
        const res = await Promise.all(response.assets.map(async (asset) => {

          
          return await uploadImage(asset);
        }));
        console.log(res,'这是热水')
        setImageList([...imageList, ...res]);

      }

      // You can now use the chosen image as an avatar
    }


  }


  // 上传图片api调用
  async function uploadImage(params: Asset) {
    const formData = new FormData();
    formData.append('file', {
      uri: params.uri,
      type: params.type,
      name: params.fileName,
    });
    const { data } = await updateFile(formData);
    Image.getSize(data.previewUrl, (width, height) => {
      data.width = window.width * 0.8;
      data.height = (window.width * height / width) * 0.8;
    });
    return data;
  }
  //删除图片
  function deleteImage(id: string) {
    setImageList(imageList.filter((image) => image.id !== id));
  }

  return {
    handleChooseImage,
    imageList,
    deleteImage,
  };

};


export default useUpdateFile;
