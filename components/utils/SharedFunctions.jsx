import { format } from "date-fns";
import {
  setSecondaryFormData,
  setShowSecondaryFormDialog,
} from "../../store/slices/ui";
import store from "../../store/Config";
import { parse, isValid } from "date-fns";

export const toggleSecondaryFormModal = async (
  type,
  sheep_id,
  isSecondaryFormDialogVisible,
  dateFormat,
  dispatch
) => {
  console.log(
    "togglesecondarymodal",
    type,
    sheep_id,
    isSecondaryFormDialogVisible,
    dateFormat,
    dispatch
  );
  const today = new Date();
  const df = dateFormat === "mdy" ? "MM/dd/yyyy" : "dd/MM/yyyy";
  const formattedDate = format(today, df);
  const data = {
    type: type,
    date: formattedDate,
    sheep_id: sheep_id,
  };
  dispatch(setSecondaryFormData(data));
  dispatch(setShowSecondaryFormDialog(!isSecondaryFormDialogVisible));
};

export const validateDate = (value, dateFormat) => {
  console.log("here", value, dateFormat);
  const df = dateFormat === "mdy" ? "MM/dd/yyyy" : "dd/MM/yyyy";
  const dateValidator =
    dateFormat === "mdy"
      ? /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/
      : /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;
  if (value && !dateValidator.test(value)) {
    return `Invalid date format. Please use ${df}`;
  }
  if (value) {
    const parsedDate = parse(value, df, new Date());
    return isValid(parsedDate) || `Invalid date format. Please use ${df}`;
  }
};

export const dateSaveFormatter = (value, dateFormat) => {
  if (value === null || value === undefined || value === "") {
    return "";
  } else if (dateFormat === "dmy") {
    return format(parse(value, "dd/MM/yyyy", new Date()), "MM/dd/yyyy");
  } else {
    return value;
  }
};

export const dateDisplayFormatter = (value, dateFormat) => {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  } else if (dateFormat === "dmy") {
    return format(parse(value, "MM/dd/yyyy", new Date()), "dd/MM/yyyy");
  } else {
    return value;
  }
};
