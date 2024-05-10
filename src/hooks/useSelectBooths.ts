

import { useRequest } from 'ahooks';
import { getOpenBooth, getOpenBoothByWine } from '@api/booths';
import { useImmer } from 'use-immer';


type IParams = {
  peopleNum?: number,
  areaId: string,
  entranceDate: string
  type?: undefined | 'getOpenBoothByWine'
}

export default ({ areaId, entranceDate, peopleNum, type }: IParams) => {




  useRequest(() => !type ? getOpenBooth({ areaId, entranceDate, peopleNum }) : getOpenBoothByWine({ areaId, entranceDate, peopleNum }), {
    onSuccess: (res) => {
      setBooths(darft => {
        const list = res?.data?.boothList ?? [];
        darft.list = list

        darft.picture = res?.data?.picture;
        const index = list.findIndex(d => d.isOpen)
        console.log(index, 'index');

        if (~index) {
          darft.activeIndex = index
        }

      });
    },
  });
  const [booths, setBooths] = useImmer({
    activeIndex: 0,
    list: [],
    picture: null,
  });


  const itemPress = (i: number) => {
    setBooths((draft) => {
      draft.activeIndex = i;
    });
  };


  return {
    booths,
    itemPress,
  };
};


