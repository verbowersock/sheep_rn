import { TextInput, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { forwardRef } from "react";

const MyTextInput = ({ ...rest }, ref) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <TextInput
      ref={ref}
      mode={"outlined"}
      outlineColor={theme.colors.primary}
      style={styles.sheepTextInput}
      activeOutlineColor={theme.colors.primary}
      {...rest}
    />
  );
};
export default forwardRef(MyTextInput);

const makeStyles = (theme) =>
  StyleSheet.create({
    sheepTextInput: {
      marginTop: 10,
      width: "100%",
    },
  });
