import * as React from "react";
import { Modal, View } from "react-native";
import { Button, Paragraph, Dialog, Portal } from "react-native-paper";
import { resetShowConfirmationDialog, uiSelector } from "../store/slices/ui";

import { useDispatch, useSelector } from "react-redux";

import { deleteBreed, deleteColor, deleteMarking } from "../services/db";

import {
  deleteColor as deleteColorRedux,
  deleteMarking as deleteMarkingRedux,
  deleteBreed as deleteBreedRedux,
} from "../store/slices/attributes";

const ConfirmationDialog = ({ onConfirm }) => {
  const { isConfirmationDialogVisible } = useSelector(uiSelector);
  const { visible, id, title, field } = isConfirmationDialogVisible;
  console.log(title);
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
          <Button mode="text" color="#68c25a" onPress={hideDialog}>
            Cancel
          </Button>
          <Button
            mode="contained"
            dark
            color="#68c25a"
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
