import storage from '../index';
import { KEY } from './key';

type ISelectShop = {
  id: string,
}
export const save = async (selectShop: ISelectShop) => {
  const { id } = selectShop;
  const data = {
    selectId: id,
  };
  await storage.save({
    key: KEY,
    data,
  });
  return data;
};


export const load = async () => {
  const data = await storage.load({
    key: KEY,
  });

  return data;
};

export const remove = () => {
  storage.remove({
    key: KEY,
  });
};
