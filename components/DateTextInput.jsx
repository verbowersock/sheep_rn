import React, { useEffect } from "react";
import { Masks, useMaskedInputProps } from "react-native-mask-input";
import MyTextInput from "./MyTextInput";

const DateTextInput = ({ label, field, onChangeText, value }) => {
  const [date, setDate] = React.useState(value);

  useEffect(() => {
    console.log({ label, field, onChangeText, value });
  }, []);

  const maskedInputPropsDate = useMaskedInputProps({
    value: date,
    onChangeText: (text) => handleChange(text),
    mask: Masks.DATE_MMDDYYYY,
  });

  const handleChange = (text) => {
    console.log(text);
    setDate(text);
    onChangeText(text);
  };

  return (
    <MyTextInput
      placeholder={label}
      value={date}
      label={label}
      {...maskedInputPropsDate}
    />
  );
};

export default DateTextInput;
