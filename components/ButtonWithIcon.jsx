import { Button, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";

const ButtonWithIcon = ({ name, label, onPress, contentStyle }) => {
  const theme = useTheme();
  return (
    <Button
      icon={() => <Icon name={name} size={20} color={theme.colors.onPrimary} />}
      buttonColor={theme.colors.primary}
      textColor={theme.colors.onPrimary}
      style={{
        paddingHorizontal: 5,
        marginBottom: 10,
      }} // Adjust alignment as needed
      onPress={onPress}
      mode="elevated"
      compact
      contentStyle={contentStyle}
    >
      {label}
    </Button>
  );
};

export default ButtonWithIcon;
