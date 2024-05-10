import type { HeaderIcon } from '@rneui/base/dist/Header/components/HeaderIcon';
import { Avatar, Header, Icon, Text, useTheme } from '@rneui/themed';
import React from 'react';
import type { TextProps } from 'react-native';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
declare type HeaderSubComponent =
  | React.ReactElement<{}>
  | TextProps
  | HeaderIcon;

interface TUIChatHeaderProps {
  title?: string;
  avatarUrl?: string;
  leftComponent?: HeaderSubComponent;
  centerComponent?: HeaderSubComponent;
  rightComponent?: HeaderSubComponent;
  backgroundColor?: string;
}
/* 聊天的head */
export const TUIChatHeader = (props: TUIChatHeaderProps) => {
  const { title, avatarUrl, centerComponent, leftComponent, rightComponent } =
    props;
  const { theme } = useTheme();

  const getRightComponent = () => {
    return rightComponent;
  };

  return (
    <Header
      containerStyle={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottomColor: theme.colors.grey5,
        paddingLeft: 20,
        backgroundColor: theme.colors.white,
      }}
      leftComponent={{
        icon: 'arrow-back-ios',
        color: 'black',
        size: 17,
      }}
      centerComponent={{ text: title, style: styles.heading }}
      rightComponent={getRightComponent()}
      backgroundColor={theme.colors.black}
      placement="center"
    />
  );
};

const styles = StyleSheet.create({
  heading: {
    color: 'white',
    fontSize: 16,
  },
});
