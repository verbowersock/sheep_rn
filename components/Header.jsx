import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

//import { HeaderWrapper } from './Header.styles';

const Header = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();

  const isDrawerScreen = route.name === "Backup" || route.name === "About";
  return (
    <Appbar.Header elevated style={styles.HeaderWrapper}>
      {isDrawerScreen ? (
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
      ) : (
        <Appbar.Content title="MyFlock" titleStyle={{ color: "white" }} />
      )}
      {isDrawerScreen && <View style={{ flex: 1 }} />}
      <Appbar.Action
        icon="menu"
        color="white"
        accessible={true}
        accessibilityLabel="Main Menu"
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
