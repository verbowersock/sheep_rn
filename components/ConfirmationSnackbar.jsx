import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setShowSnackbar, uiSelector } from "../store/slices/ui";

const ConfirmationSnackbar = () => {
  const { isSnackbarVisible } = useSelector(uiSelector);
  const { visible, message, error } = isSnackbarVisible;
  const dispatch = useDispatch();
  const onDismissSnackBar = () => dispatch(setShowSnackbar(false));

  return (
    <Snackbar
      visible={visible}
      style={error ? styles.errorMessage : styles.confirmationMessage}
      onDismiss={onDismissSnackBar}
      action={{
        label: "Dismiss",
        color: "white",
        onPress: () => {
          onDismissSnackBar;
        },
      }}
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  confirmationMessage: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#c2875a",
  },
  errorMessage: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#c25a5a",
  },
});

export default ConfirmationSnackbar;
