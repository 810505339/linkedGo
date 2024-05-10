//检查人脸

import service from './base';

export interface CheckFaceParams {
  /*图片base64 */
  picBase64: string;
}

// 响应接口
export interface CheckFaceRes {
  data: {
    success: boolean
  }
}

/**
 * 人脸识别
 * @param {object} params 人脸识别入参
 * @param {string} params.picBase64 图片base64
 * @returns
 */
export async function checkFace(params: CheckFaceParams): Promise<CheckFaceRes> {
  const { data } = await service.post('consumption/customer/checkFace', params);
  return data;
}
