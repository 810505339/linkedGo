import { proxy } from 'valtio';



const userStore = proxy<any>({
  userinfo: {
  
  },
});



export default userStore;

