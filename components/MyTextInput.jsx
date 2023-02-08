import { TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { forwardRef } from "react";

const MyTextInput = ({ ...rest }, ref) => {
  return (
    <TextInput
      ref={ref}
      mode={"outlined"}
      outlineColor={"#68c25a"}
      style={styles.sheepTextInput}
      activeOutlineColor={"#68c25a"}
      {...rest}
    />
  );
};
export default forwardRef(MyTextInput);

const styles = StyleSheet.create({
  sheepTextInput: {
    marginTop: 10,
    width: "100%",
  },
});
