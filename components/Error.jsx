import { StyleSheet, View, Text, Button } from "react-native";

const Error = ({ error, resetError }) => (
  <View style={styles.mainContainer}>
    <Text style={styles.errorTitle}>Oh No! Something went wrong!</Text>
    <Text style={styles.errorText}>
      Please email myflock@gmail.com with the following error information and
      the description of what you were trying to do. We will try to resolve this
      as soon as possible.
    </Text>
    <Text style={styles.errorText}>{error.toString()}</Text>
    <View style={styles.errorButton}>
      <Button color="#9C27B0" onPress={resetError} title={"Try again"} />
    </View>
  </View>
);

const styles = StyleSheet.create({
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
    color: "black",
    textAlign: "center",
  },
  errorButton: {
    marginTop: 40,
    width: 100,
  },
});

export default Error;
