import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import { Appbar } from "react-native-paper";

//import { HeaderWrapper } from './Header.styles';

const Header = (props) => {
  return (
    <Appbar.Header dark style={styles.HeaderWrapper} elevated>
      <Appbar.Content title="MyFlock" />
    </Appbar.Header>
  );
};

Header.propTypes = {
  // bla: PropTypes.string,
};

Header.defaultProps = {
  // bla: 'test',
};

export default Header;

const styles = StyleSheet.create({
  HeaderWrapper: {
    backgroundColor: "#68c25a",
  },
});
