import service from './base';
//获取订单列表
export const getOrderList = async (params: any) => {
  const { data } = await service({
    url: '/consumption/order',
    method: 'get',
    params,
  });
  return data;
};

export const getOrderDetail = async (orderId: string) => {
  const { data } = await service({
    url: `/consumption/order/detail/${orderId}`,
    method: 'get',
  });
  return data;
};



//支付（临时）
export const tempPay = async (data: any) => {
  return service({
    url: '/consumption/order/tempPay',
    method: 'post',
    data
  });
};

// 真实支付接口
export const orderPay = (data: any) => {
  return service({
    url: `/consumption/order/pay`,
    method: 'post',
    data
  });
};



//支付成功后续流程
export const paySuccessPost = async (data: any) => {
  return service({
    url: '/consumption/order/paySuccessPost',
    method: 'post',
    data,
  });
};


//取消订单
export const cancelOrder = async (orderId: any) => {
  const { data } = await service({
    url: `/consumption/order/cancel/${orderId}`,
    method: 'get',
  });
  return data;
};
