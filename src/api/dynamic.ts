import { loadLanguageStorage } from '@storage/language/action';
import service from './base';


//根据storeId获取类型列表
export const getDynamicTypeByStoreId = async (storeId: string) => {
  const { data } = await service({
    url: `/operation/dynamicState/getDynamicTypeByStore`,
    params: {
      storeId
    },
    method: 'GET',
  });
  return data;
};

export type getDynamicListIParams = {
  current?: string,
  size?: string,
  storeId?: string, //门店ID
  typeId?: string,  //动态类型ID
}

//分页查询-C端
export const getDynamicList = async (params: getDynamicListIParams) => {




  let { data } = await service({
    url: '/operation/dynamicState/clientPage',
    method: 'GET',
    params,
  });

  return data;
};

export type getDynamicInfoIParams = {
  id: string, //动态详情入参

}


//详情查询-C端
export const getDynamicInfo = async (params: getDynamicInfoIParams) => {
  const { data } = await service({
    url: '/operation/dynamicState/clientDetail',
    method: 'GET',
    params,
  });
  return data;
};

//新增报名
export const signUp = async (params: any) => {
  const { data } = await service({
    url: '/consumption/customerActivity/signUp',
    method: 'POST',
    data: params,
  });
  return data;
};

/* 用户是否已经报名 */
export const isAlreadySignUp = async (id: string) => {
  const res = await service({
    url: `/consumption/customerActivity/isAlreadySignUp/${id}`,
    method: 'get',
  });
  console.log('请求的包名信息', res, id)
  return res.data;
};
