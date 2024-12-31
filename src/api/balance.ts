
/* 余额 */
import service from './base';

/* 获取余额信息 */
export const getBalanceInfo = async (storeId:string) => {
  console.log(storeId,'请求的data')
  if(storeId)
  {
    const { data } = await service({
      url: `/consumption/balance/customer/detail?storeId=${storeId}`,
      method: 'GET',
    })
    return data;
  }
  
};

/*余额详情分页查询-商户端  */

export const balanceDetailPage = async (params: any) => {
  const { data } = await service({
    url: '/consumption/balance/balanceDetailPage',
    method: 'GET',
    params,
  });
  return data;
};
