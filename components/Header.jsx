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
    <Appbar.Header elevated style={styles.HeaderWrapper} >
      <Appbar.Content title="MyFlock" titleStyle={{color: 'white'}}/>
      <Appbar.Action
        icon="menu"
        color="white"
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
