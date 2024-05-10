
/* 余额 */
import service from './base';

/* 获取余额信息 */
export const getBalanceInfo = async () => {
  const { data } = await service({
    url: '/consumption/balance/customer/detail',
    method: 'GET',
  });

  return data;
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
