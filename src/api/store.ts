import service from './base';
//获取门店的列表
export const getSotreList = async () => {
  console.log('请求门店列表')
  return service({
    url: '/admin/store/allEnabled',
    method: 'get',
  });
};



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



