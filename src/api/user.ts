import service from './base';

/* 查询user的总数 */
export const mineInfo = async () => {
  const { data } = await service('/consumption/customer/mineStat');
  return data;
};

//
export const detailsById = async () => {
  const { data } = await service({
    url: '/consumption/customer/details/my',
    method: 'get',
  });
  return data;
};


//我的系统消息列表
export const customerMessage = async (params: any) => {
  const { data } = await service({
    url: '/consumption/customerMessage/page',
    method: 'get',
    params,
  });
  return data;
};


//我的系统消息详情
export const customerMessageDetail = async (id: string) => {
  const { data } = await service({
    url: `/consumption/customerMessage/detail/${id}`,
    method: 'get',
  });
  return data;
};


//全部已读
export const updateRead = async () => {
  const { data } = await service({
    url: '/consumption/customerMessage/updateRead',
    method: 'post',
  });
  return data;
};


//密码登录
