import BaseLayout from '@components/baselayout';
import { RefreshControl, View } from 'react-native';
import { Text } from 'react-native-paper';
import { TabScreen, Tabs, TabsProvider } from 'react-native-paper-tabs';
import Animated from 'react-native-reanimated';
import { useImmer } from 'use-immer';
import { Item } from './modal';
import React from 'react';
import CustomFlatList from '@components/custom-flatlist';
import { getCustomerCoupon } from '@api/coupon';
import { useTranslation } from 'react-i18next';


// export const renderItem = ({ item }) => {
//   return <View className="my-2.5 mx-5 flex-row rounded-xl overflow-hidden h-24 ">
//     <View className="bg-[#EE2737] w-32 justify-center items-center ">
//       <Text className="font-bold text-white text-2xl">$1000</Text>
//       <Text>满$5000可用</Text>
//     </View>
//     <View className=" flex-auto bg-[#151313FF] p-2.5">
//       <Text className="text-xs font-bold">门票现金券</Text>
//       <View className="flex-row  flex-auto mt-2">
//         <Text style={{ fontSize: 10 }} className="bg-[#EE273733] rounded-2xl px-2 mr-2 h-5 leading-5">现金券</Text>
//         <Text style={{ fontSize: 10 }} className="bg-[#E6A05533] rounded-2xl px-2  h-5 leading-5">适用商品</Text>
//       </View>
//       <Text style={{ fontSize: 10 }} className="font-light text-[#ffffff7f]">有效期至 2023/10/01</Text>
//     </View>
//   </View>;
// };


const Coupons = () => {

  const { t } = useTranslation();

  const tabs = [
    {
      title: t('coupons.text1'),
      status: true,
    },
    {
      title: t('coupons.text2'),
      status: false,
    },
  ];

  const [data, setData] = useImmer({

    defaultIndex: 0,
  });

  const onChangeIndex = (index: number) => {
    setData(darft => {
      darft.defaultIndex = index;
    });
  };


  return (<BaseLayout >
    <TabsProvider
      defaultIndex={data.defaultIndex}
      onChangeIndex={onChangeIndex}
    >
      <Tabs
        uppercase={true} // true/false | default=true (on material v2) | labels are uppercase
        // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
        // iconPosition // leading, top | default=leading
        style={{ backgroundColor: 'transparent' }} // works the same as AppBar in react-native-paper
        dark={true} // works the same as AppBar in react-native-paper
        // theme={} // works the same as AppBar in react-native-paper
        mode="scrollable" // fixed, scrollable | default=fixed
        showLeadingSpace={false} //  (default=true) show leading space in scrollable tabs inside the header
        disableSwipe={false} // (default=false) disable swipe to left/right gestures
      >
        {tabs.map((tab, index) => {
          const available = tabs[index].status;

          return (<TabScreen label={tab.title} key={index} >
            <View>

              {index === data.defaultIndex && <CustomFlatList
                renderItem={(item, index) => <Item item={item} index={index} t={t} available={available} showCheck={false} />} onFetchData={getCustomerCoupon} keyExtractor={(item) => item.id} params={{ available: available }}
              />}
            </View>
          </TabScreen>);
        })}

      </Tabs>
    </TabsProvider>
  </BaseLayout>);

};


export default Coupons;
