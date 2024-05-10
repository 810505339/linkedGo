import { getHeaderTitle } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React, { type FC } from 'react';
import { Image } from 'react-native';
import { Appbar } from 'react-native-paper';


export const CustomNavigationBar: FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  options,
  back,
}) => {
  const title = getHeaderTitle(options, '');

  const Right = options.headerRight || (() => null);
  return (
    <Appbar.Header>
      {/* {back ? <Image source={red} /> : null} */}
      <Appbar.Content title={title} />
      <Right />
    </Appbar.Header>
  );
};
