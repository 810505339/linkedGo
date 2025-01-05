/*
 * @Author: 810505339
 * @Date: 2024-07-11 13:46:26
 * @LastEditors: 810505339
 * @LastEditTime: 2024-12-03 16:48:01
 * @FilePath: \linkedGo\src\api\store.ts
 * 记得注释
 */
import service from './base';
//获取门店的列表
export const getSotreList = async () => {
 
  return service({
    url: '/admin/store/allEnabled',
    method: 'get',
  });
};

export const getTenantList=async ()=>{

  return service({
    url: '/admin/tenant/app/list',
    method: 'get',
  });
}



//通过门店ID和时间查询区域

export const getAreaById = async (storeId: string, params: any) => {
  const { data } = await service({
    url: `/consumption/common/getAreaByStoreId/${storeId}`,
    method: 'get',
    params: params,
  });

  return data;
};


//onSaleNum 获取可售门票

export const onSaleNum = async (body: any) => {
  const { data } = await service({
    url: '/consumption/ticket/onSaleNum',
    method: 'post',
    data: body,
  });

  return data?.data;
};



