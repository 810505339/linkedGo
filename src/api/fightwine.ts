import service from './base';


//可选酒局模式

export const selectableMode = async (url: string = 'allMode') => {
  const { data } = await service({
    url: `/consumption/wineParty/${url}`,
    method: 'get',
  });

  return data;
};


//校验卡座占用
export const checkBooth = async (data: any) => {
  const { data: res } = await service({
    url: '/consumption/wineParty/checkBooth',
    method: 'POST',
    data,
  });

  return res;
};


//发起酒局

export const create = async (data: any) => {
  const { data: res } = await service({
    url: '/consumption/wineParty/create',
    method: 'POST',
    data,
  });

  return res;
};



///consumption/wineParty/calPayAmount

export const calPayAmount = async (data: any) => {
  const { data: res } = await service({
    url: '/consumption/wineParty/calPayAmount',
    method: 'POST',
    data,
  });

  return res;
};



///酒局广场
export const winePartyByAll = async (params: any) => {
  const { data: res } = await service({
    url: '/consumption/wineParty/page/all',
    method: 'GET',
    params,
  });

  return res;
};


///酒局详情
export const winePartyByDetail = async (partyId: string) => {
  const { data: res } = await service({
    url: `/consumption/wineParty/detail/${partyId}`,
    method: 'GET',
  });

  return res;
};


//加入酒局

export const joinWineParty = async (data: any) => {
  const { data: res } = await service({
    url: '/consumption/wineParty/join',
    method: 'PUT',
    data: data,
  });

  return res;
};

//我的酒局
export const myWinePartyApi = async (params: any) => {
  const { data: res } = await service({
    url: '/consumption/wineParty/page/my',
    method: 'GET',
    params,
  });

  return res;
};

//加入酒局审批（我买单模式）
export const joinApproval = async (data: any) => {
  const { data: res } = await service({
    url: '/consumption/wineParty/player/joinApproval',
    method: 'put',
    data,
  });
  return res;
};
//踢人（我买单模式）
export const kickOut = async (data: any) => {
  const { data: res } = await service({
    url: '/consumption/wineParty/player/kickOut',
    method: 'put',
    data,
  });
  return res;
};


export const cancelWineParty = async (partyId: string) => {
  const { data: res } = await service({
    url: `/consumption/wineParty/cancel/${partyId}`,
    method: 'put',
  });
  return res;
};


//退出酒局
export const quitWineParty = async (partyId: any) => {
  const { data: res } = await service({
    url: `/consumption/wineParty/quit/${partyId}`,
    method: 'put',
  });
  return res;
};


//检查是否需要锁局确认
export const checkNeedLockConfirm = async (partyId: any) => {
  const { data: res } = await service({
    url: `/consumption/wineParty/checkNeedLockConfirm/${partyId}`,
    method: 'get',
  });
  return res;
};


//确认锁局
export const lockConfirm = async (partyId: any) => {
  const { data: res } = await service({
    url: `/consumption/wineParty/lockConfirm/${partyId}`,
    method: 'put',
  });
  return res;
};


//发起酒局评价
export const submitComment = async (data: any) => {
  return await service({
    url: `/consumption/wineParty/comment`,
    method: 'post',
    data
  });
};

//评价列表
export const commentPage = async (partyId: any) => {
  return await service({
    url: `/consumption/wineParty/comment/getByPartyId/${partyId}`,
    method: 'get'
  });
};

//是否开启临时酒局
export const tempPartyOpenStatus = (data: any) => {
  return service({
    url: `/consumption/wineParty/create/preProcessing`,
    method: 'post',
    data
  });
};

