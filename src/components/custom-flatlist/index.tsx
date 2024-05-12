import { useRequest } from 'ahooks';
import React, { useEffect, forwardRef, useImperativeHandle, Ref, memo } from 'react';
import { FlatList, RefreshControl, Text, View, RefreshControlProps, Image } from 'react-native';
import { useImmer } from 'use-immer';
import { ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';




const noData = require('@assets/imgs/base/noData.png');

interface IPaginatedFlatListProps<T> {
  renderItem: (item: T, index: number) => React.ReactNode;
  data?: T[];
  onFetchData: (page: number) => Promise<T[]>;
  initialPage?: number;
  size?: number;
  refreshControlProps?: RefreshControlProps;
  errorComponent?: React.ReactNode;
  noDataComponent?: React.ReactNode;
  renderHeader?: React.ReactNode;
  noMoreData?: React.ReactNode;
  params?: any,
  disabled?: boolean,
  keyExtractor: (item: any) => any
  getList?: (list: any) => void

}

const INIT_STATE = {
  isLoading: true,
  isRefreshing: false,
  hasMoreData: true,
  error: null,
};



const RenderNoData = () => {
  const { t } = useTranslation();
  return <View className="mt-40  justify-center items-center" >
    <Image source={noData} resizeMode="contain" />
    <Text className="mt-2 opacity-50 text-xs font-bold text-white">{t('flatList.noMore')}</Text>
  </View>;
};

const RendernoMoreData = () => {
  const { t } = useTranslation();
  return <Text className="text-center p-3 text-white">{t('flatList.noMore1')}</Text>;
};

type CustomFlatListRef = {
  refreshData: () => Promise<void>
}



const CustomFlatList = forwardRef<CustomFlatListRef, IPaginatedFlatListProps<any>>((props, ref: Ref<CustomFlatListRef>) => {
  const {
    renderItem,
    data = [],
    onFetchData,
    initialPage = 1,
    size = 10,
    params = {},
    refreshControlProps,
    errorComponent = <Text>Oops! Something went wrong.</Text>,
    noMoreData = <RendernoMoreData />,
    noDataComponent = <RenderNoData />,
    ListHeaderComponent = <></>,
    getList,
    ...rest
  } = props;





  const [allData, setAllData] = useImmer({
    current: initialPage,
    ...INIT_STATE,
    data,
  });

  const { isRefreshing, hasMoreData, error, isLoading } = allData;

  const { run, cancel } = useRequest(onFetchData, {
    manual: true,

    onSuccess(res) {



      if (!('data' in res)) {
        setAllData((draft) => {
          draft.hasMoreData = true;
          draft.isLoading = false;
          console.log(draft.isLoading, '!data in res');

        });
        return;
      }
      const total = res?.data?.total ?? 0;
      const records = res?.data?.records ?? [];



      setAllData((draft) => {
        const allList = isRefreshing ? [...records] : [...draft?.data, ...records];
        draft.data = allList
        // console.log(draft.data);
        draft.hasMoreData = total <= draft.data.length;
        draft.isLoading = !draft.hasMoreData;
      });
      getList?.([...allData?.data, ...records])

    },
    onBefore() {
      setAllData((draft) => {
        draft.isLoading = true;

      });
    },
    onError() {
      console.log(1);

      setAllData((draft) => {
        draft.hasMoreData = true;
      });
    },
    onFinally: async () => {
      //请求结束

      setAllData((draft) => {
        draft.isRefreshing = false;

      });
    },
  });

  // 当 current 发生变化时，重新获取数据
  useEffect(() => {
    run({ ...params, current: allData.current, size });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData.current]);

  // 上拉请求分页
  const fetchData = () => {
    if (allData.hasMoreData) {
      return;
    }

    setAllData(draft => {
      draft.current += 1;
    });
  };

  // 下拉刷新
  const refreshData = async (more: any) => {
    setAllData((draft) => {
      draft.isRefreshing = true;
      draft.hasMoreData = true;
      draft.current = 1;
      draft.data = [];
    });
    cancel();
    console.log(params, '触发了下拉刷新')
    run({ ...params, current: 1, size, ...more });
  };

  // 渲染每个 item
  const renderItemWithIndex = ({ item, index }: { item: T; index: number }) => renderItem(item, index);


  const ListFooterComponent = () => {
    if (isLoading) {
      return <View className="h-10 flex-row items-center justify-center">
        <ActivityIndicator />
      </View>;
    }
    console.log(hasMoreData);

    if (hasMoreData && allData.data.length > 0) {
      return RendernoMoreData();
    }
  };



  useImperativeHandle(ref, () => ({
    refreshData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  // 渲染 FlatList
  return (
    <FlatList
      ListHeaderComponent={ListHeaderComponent}
      data={allData.data}
      {...rest}
      refreshing={isLoading}
      renderItem={({ item, index }) => renderItemWithIndex({ item, index })}

      refreshControl={
        < RefreshControl refreshing={isRefreshing} onRefresh={refreshData} {...refreshControlProps} />
      }

      onEndReached={fetchData}
      ListEmptyComponent={
        !isLoading && <RenderNoData />
      }
      ListFooterComponent={
        ListFooterComponent
      }
    />);
});


export default memo(CustomFlatList);
