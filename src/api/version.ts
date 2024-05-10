import service from './base';

export const getVersion = async (params: any) => {

  const { data } = await service({
    url: '/admin/applicationVersion/getLatestVersion',
    method: 'get',
    params
  });
  return data;
}
