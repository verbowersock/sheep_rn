
import { format } from "date-fns";
import { setSecondaryFormData, setShowSecondaryFormDialog } from "../../store/slices/ui";
import store from "../../store/Config";

export const toggleSecondaryFormModal = async (type, sheep_id, isSecondaryFormDialogVisible, dispatch, onSubmit) => {
  const today = new Date();
  const formattedDate = format(today, "MM/dd/yyyy");
  const data = { type: type, date: formattedDate, sheep_id: sheep_id, value: "" };
  dispatch(setSecondaryFormData(data));
  dispatch(setShowSecondaryFormDialog(!isSecondaryFormDialogVisible));
  const unsubscribe = store.subscribe(() => {
    const isDialogVisible = store.getState().ui.isSecondaryFormDialogVisible;
    if (!isDialogVisible) {
      unsubscribe();
      onSubmit();
    }
  });
};