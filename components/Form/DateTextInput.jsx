import React, { useEffect } from "react";
import { Masks, useMaskedInputProps } from "react-native-mask-input";
import { useTheme } from "react-native-paper";
import MyTextInput from "./MyTextInput";

const DateTextInput = ({ label, field, onChangeText, value, error }) => {
  const theme = useTheme();
  const maskedInputPropsDate = useMaskedInputProps({
    value: value ? value : "",
    onChangeText: (text) => onChangeText(text),
    mask: Masks.DATE_MMDDYYYY,
  });

  return (
    <MyTextInput
      keyboardType="numeric"
      error={error}
      placeholder={label}
      value={maskedInputPropsDate.value}
      label={label}
      {...maskedInputPropsDate}
    />
  );
};

export default DateTextInput;
