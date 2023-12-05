import * as React from "react";
import { StyleSheet } from "react-native";
import { useTheme, Snackbar, Portal } from "react-native-paper";
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
    <Portal>
      <Snackbar
        visible={visible}
        style={error ? styles.errorMessage : styles.confirmationMessage}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Dismiss",
          labelStyle: { color: theme.colors.background },
          onPress: () => {
            onDismissSnackBar;
          },
        }}
      >
        {message}
      </Snackbar>
    </Portal>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    confirmationMessage: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: theme.colors.primary,
    },
    errorMessage: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: theme.colors.error,
    },
  });

export default ConfirmationSnackbar;
