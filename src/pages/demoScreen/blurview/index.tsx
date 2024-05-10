import BaseLayout from '@components/baselayout';
import CustomFlatList from '@components/custom-flatlist';
import { Text, View } from 'react-native';
import { getCustomerCoupon } from '@api/coupon';



export default function Menu() {

  const renderItem = (item, index) => {
    return (<View  className="h-[1000px] bg-violet-500">
      <Text>{item?.name}</Text>
    </View>);
  };

  return (
    <BaseLayout>
      <CustomFlatList renderItem={renderItem} onFetchData={getCustomerCoupon} />
    </BaseLayout>
  );
}


