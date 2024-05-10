
import service from './base';

/* 查询用户可用的优惠列表 */
export const getCustomerCoupon = async (data: any) => {
  const { data: res } = await service({
    url: '/operation/coupon/getCustomerCoupon',
    method: 'get',
    params: data,
  });

  return res;
};


/* 优惠明细 */

export const getCouponSimpleDetail = async (data: any) => {
  const { data: res } = await service({
    url: '/operation/coupon/getCouponSimpleDetail',
    method: 'GET',
    params: data,
  });

  return res;
};

/* 查询优惠后的价格 */

export const discounts = async (data: any) => {
  const { data: res } = await service({
    url: '/operation/coupon/discounts',
    method: 'GET',
    params: data,
  });

  return res;
};
