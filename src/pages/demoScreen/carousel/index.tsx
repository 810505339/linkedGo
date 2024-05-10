import BaseLayout from '@components/baselayout';
import Carousel from 'react-native-reanimated-carousel';
import { Dimensions, View } from 'react-native';
import { useState } from 'react';
const PAGE_WIDTH = Dimensions.get('window').width;
const Carouseldemo = () => {
  const [data, setData] = useState([...new Array(4).keys()]);

  return (<BaseLayout>
    <Carousel
      width={PAGE_WIDTH}
      loop
      testID={'xxx'}
      style={{ width: '100%' }}
      autoPlay={true}
      autoPlayInterval={2000}
      data={data}
      pagingEnabled={true}
      // onSnapToItem={index => console.log('current index:', index)}
      renderItem={({ index }) => <View key={index}  className="border w-5 h-5"/>}
    />
  </BaseLayout>);

};


export default Carouseldemo;
