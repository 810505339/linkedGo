import { IM_KEY } from '@storage/shop/key';
import storage from '@storage/index';
import { proxy } from 'valtio';



const userStore = proxy<any>({
  userinfo: {},
});



export default userStore;

