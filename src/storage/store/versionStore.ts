import { useEffect, useState } from 'react';
import { proxy } from 'valtio';


type IStore = {
  versionNumber: string,
  versionIntroduce: string,
  isForceUpdate: number,
  packageFile: string,
  sensitivenessOn: string
}

export const store = proxy<{ app: IStore }>({
  app: {
    versionNumber: '',
    versionIntroduce: '',
    isForceUpdate: 0,
    packageFile: '',
    sensitivenessOn: ''
  },
});

export const getStore = (data: IStore) => {
  console.log(data, 'getStore')
  store.app = data
}

/* 判断是否审核 */
export const useStore = () => {
  const [sensitiveness, setSensitiveness] = useState(false)
  useEffect(() => {
    if (store.app.sensitivenessOn === '0') {
      setSensitiveness(true)
    } else {
      setSensitiveness(false)
    }

  }, [store.app.sensitivenessOn])
  return {
    sensitiveness
  }
};


