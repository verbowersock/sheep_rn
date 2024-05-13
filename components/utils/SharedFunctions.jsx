import { format } from "date-fns";
import {
  setSecondaryFormData,
  setShowSecondaryFormDialog,
  uiSelector,
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

export const dateDisplayFormatter = (
  value,
  dateFormat,
  monthFormat = "number"
) => {
  if (value === null || value === undefined || value === "") {
    return "NA";
  } else if (monthFormat === "abbr") {
    return format(parse(value, "MM/dd/yyyy", new Date()), "MMM dd, yyyy");
  } else if (dateFormat === "dmy") {
    return format(parse(value, "MM/dd/yyyy", new Date()), "dd/MM/yyyy");
  } else {
    return value;
  }
};

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const sortAlphabetically = (data, key) => {
  return data.sort((a, b) =>
    a[key].toLowerCase().localeCompare(b[key].toLowerCase())
  );
};

export const convertUnitsDisplay = (value, unitFormat) => {
  if (unitFormat === "kg") {
    // convert value from lb to kg
    return Math.round(value * 0.453592 * 10) / 10;
  } else {
    return value;
  }
};

export const convertUnitsSave = (value, unitFormat) => {
  if (unitFormat === "kg") {
    // convert value from kg to lb
    //round value to nearest decimal
    return Math.round((value / 0.453592) * 10) / 10;
  } else {
    return value;
  }
};
