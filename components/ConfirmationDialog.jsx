import * as React from "react";
import { Modal } from "react-native";
import { Button, Paragraph, Dialog, useTheme } from "react-native-paper";
import { resetShowConfirmationDialog, uiSelector } from "../store/slices/ui";
import { StyleSheet } from "react-native" 
  


import { useDispatch, useSelector } from "react-redux";

const ConfirmationDialog = ({ onConfirm }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { isConfirmationDialogVisible } = useSelector(uiSelector);
  const { visible, id, tag_id, name, title, field } = isConfirmationDialogVisible;
  const dispatch = useDispatch();

  const hideDialog = () => {
    dispatch(resetShowConfirmationDialog());
  };

  const onConfirmDelete = () => {
    onConfirm(id, field, title);
  };

  return (
    <Modal visible={visible} transparent={false} >
      <Dialog visible={visible} onDismiss={hideDialog} style={{ zIndex: 9999, backgroundColor: theme.colors.surface }}>
        <Dialog.Title>Delete</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            {field !== "sheep"
              ? `Are you sure you want to delete ${field} ${title}?`
              : `Are you sure you want to delete ${name? name: tag_id}?`}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            display: "flex",
            flexDirection: "row",

            justifyContent: "space-between",
          }}
        >
          <Button style = {styles.button} mode="text" textColor={theme.colors.primary} onPress={hideDialog}>
            Cancel
          </Button>
          <Button
          style = {styles.button}
            mode="contained"
            buttonColor={theme.colors.error}
            onPress={() => onConfirmDelete()}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Modal>
  );
};

export default ConfirmationDialog;

const makeStyles = (theme) =>
  StyleSheet.create({
    button: {
      width: 100,
    },
  });
