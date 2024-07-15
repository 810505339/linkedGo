import { getCommonFileUrl } from '@api/common';
import { proxy } from 'valtio';

export interface IProxy {
  fileUrl: string
}

export const fileStore = proxy<IProxy>({
  fileUrl: '',
});


export const getFileUrl = async () => {
  const { data } = await getCommonFileUrl();
  fileStore.fileUrl = data;
};
