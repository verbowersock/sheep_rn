import React from "react";
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ReviewShare = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <ScrollView style={styles.mainContainer}>
      <Text style={styles.reviewTitle}>Review Or Share</Text>

      <Text style={styles.reviewSubtitle}>Like the app?</Text>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            "https://play.google.com/store/apps/details?id=com.sheeprn&hl=en_US&gl=US"
          )
        }
        style={styles.touchableStyle}
      >
        <Icon name="star" size={25} color={theme.colors.primary} />
        <Text style={styles.touchableText}>Leave a 5 star review</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Share.share({
            message:
              "Check out this awesome app for sheep management: https://play.google.com/store/apps/details?id=com.sheeprn&hl=en_US&gl=US",
            title: "Share App",
          });
        }}
        style={styles.touchableStyle}
      >
        <Icon
          name="share-variant-outline"
          size={25}
          color={theme.colors.primary}
        />
        <Text style={styles.touchableText}>Share the app</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReviewShare;

const makeStyles = (theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: "column",
      margin: 20,
    },
    reviewTitle: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.colors.text,
    },

    reviewSubtitle: {
      paddingTop: 10,
      paddingBottom: 20,
      fontSize: 17,
      color: theme.colors.text,
    },
    bold: {
      fontWeight: "bold",
    },
    touchableStyle: {
      paddingVertical: 15,
      flexDirection: "row",
    },

    touchableText: {
      marginLeft: 15,
      color: theme.colors.primary,
      fontSize: 17,
    },
  });
