import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

//import { HeaderWrapper } from './Header.styles';

const Header = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation();
  return (
    <Appbar.Header dark style={styles.HeaderWrapper} elevated>
      <Appbar.Content title="MyFlock" />
      <Appbar.Action
        icon="menu"
        onPress={() => {
          navigation.toggleDrawer();
        }}
      />
    </Appbar.Header>
  );
};

export default Header;

const makeStyles = (theme) =>
  StyleSheet.create({
    HeaderWrapper: {
      width: "100%",
      height: 60,
      backgroundColor: theme.colors.primary,
    },
  });
