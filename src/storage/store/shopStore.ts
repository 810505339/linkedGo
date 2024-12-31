/*
 * @Author: 810505339
 * @Date: 2024-10-30 09:17:32
 * @LastEditors: 810505339
 * @LastEditTime: 2024-12-31 11:20:16
 * @FilePath: \linkedGo\src\storage\store\shopStore.ts
 * 记得注释
 */
import { getSotreList,getTenantList } from '@api/store';
import { load } from'@storage/shop/action';
import { proxy } from 'valtio';

export type IShopItem = {
  id: string,
  name: string,
}

type IProxy = {
  shopList: IShopItem[]

}
export const store = proxy<IProxy>({
  shopList: [],
});


export const initList = async () => {
  const { data } = await getSotreList();


  store.shopList = data.data;
  return data.data;
};

export const findIndex = (id: string) => {
  return store.shopList.find(s => s.id == id);
};


