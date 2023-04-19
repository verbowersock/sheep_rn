import * as React from "react";
import { Modal } from "react-native";
import { Button, Paragraph, Dialog, useTheme } from "react-native-paper";
import { resetShowConfirmationDialog, uiSelector } from "../store/slices/ui";

import { useDispatch, useSelector } from "react-redux";

const ConfirmationDialog = ({ onConfirm }) => {
  const theme = useTheme();

  const { isConfirmationDialogVisible } = useSelector(uiSelector);
  const { visible, id, title, field } = isConfirmationDialogVisible;
  const dispatch = useDispatch();

  const hideDialog = () => {
    dispatch(resetShowConfirmationDialog());
  };

  const onConfirmDelete = () => {
    onConfirm(id, field, title);
  };

  return (
    <Modal visible={visible} transparent={false}>
      <Dialog visible={visible} onDismiss={hideDialog} style={{ zIndex: 9999 }}>
        <Dialog.Title>Delete</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            {field !== "sheep"
              ? `Are you sure you want to delete ${field} ${title}?`
              : `Are you sure you want to delete this sheep ${id}?`}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            display: "flex",
            flexDirection: "row",
            paddingHorizontal: 80,
            justifyContent: "space-between",
          }}
        >
          <Button mode="text" color={theme.colors.primary} onPress={hideDialog}>
            Cancel
          </Button>
          <Button
            mode="contained"
            dark
            color={theme.colors.error}
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
