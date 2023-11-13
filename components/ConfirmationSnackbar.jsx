import * as React from "react";
import { StyleSheet } from "react-native";
import { useTheme, Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setShowSnackbar, uiSelector } from "../store/slices/ui";

const ConfirmationSnackbar = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
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
        color: theme.colors.background,
        onPress: () => {
          onDismissSnackBar;
        },
      }}
    >
      {message}
    </Snackbar>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    confirmationMessage: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: theme.colors.secondary,
    },
    errorMessage: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: theme.colors.error,
    },
  });

export default ConfirmationSnackbar;
