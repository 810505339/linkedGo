
import service from './base';

type IParams = {
  status: string,
  size: string,
  current: string
}
export const myTicket = async (params: IParams) => {
  const { data } = await service({
    url: '/consumption/ticket/myTicket',
    method: 'get',
    params: params,
  });
  return data;
};


export const ticketBooking = async (params: any) => {
  const data = await service({
    url: 'consumption/ticket/booking',
    method: 'POST',
    data: params,
  });
  return data;
};

//生成门票二维码加密串
export const genQrCodeStr = async (cusTicketId: string) => {
  const data = await service({
    url: `/consumption/ticket/genQrCodeStr/${cusTicketId}`,
    method: 'POST',
  });
  return data;
};
//赠送门票
export const ticketGiven = (data: any) => {
  return service({
    url: `/consumption/ticket/given`,
    method: 'post',
    data
  });
};
