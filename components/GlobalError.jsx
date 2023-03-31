import { StyleSheet, View, Text, Button } from "react-native";
import { useTheme } from "react-native-paper";

const GlobalError = ({ error, resetError }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.errorTitle}>Oh No! Something went wrong!</Text>
      <Text style={styles.errorText}>
        Please email myflock@gmail.com with the following error information and
        the description of what you were trying to do. We will try to resolve
        this as soon as possible.
      </Text>
      <Text style={styles.errorText}>{error.toString()}</Text>
      <View style={styles.errorButton}>
        <Button
          color={theme.colors.accent}
          onPress={resetError}
          title={"Try again"}
        />
      </View>
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    errorTitle: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
    },
    errorText: {
      padding: 10,
      fontSize: 20,
      color: theme.colors.text,
      textAlign: "center",
    },
    errorButton: {
      marginTop: 40,
      width: 100,
    },
  });

export default GlobalError;
