import { StyleSheet, Text, ScrollView } from "react-native";
import { Paragraph, useTheme } from "react-native-paper";

const About = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <ScrollView style={styles.mainContainer}>
      <Text style={styles.aboutSubtitle}>Version 1.0.0</Text>
      <Text style={styles.aboutTitle}>About myFlock</Text>

      <Text style={styles.aboutSubtitle}>What is it?</Text>
      <Paragraph style={styles.aboutParagraph}>
        MyFlock is the must-have app for small sheep flock owners. Developed by
        a dedicated hobby sheepkeeper, this app is specifically designed to help
        you keep accurate records of your sheep without compromising your
        privacy. With myFlock, you can easily store and organize data on your
        sheep, including their breed, age, color, important dates, and more. You
        can also add photos to each sheep's profile.
      </Paragraph>
      <Text style={styles.aboutSubtitle}>Why myFlock?</Text>
      <Paragraph style={styles.aboutParagraph}>
        Unlike other apps on the market, myFock stores all your data internally
        and never shares it with any third-party services. You can rest assured
        that your sheep records are safe and secure at all times.
      </Paragraph>
      <Text style={styles.aboutSubtitle}>How to use</Text>
      <Paragraph style={styles.aboutParagraph}>
        To get started, click the plus button on the bottom of the screen and
        fill out the data for your sheep. You can add more colors, breeds and
        markings as needed. If you need to remove a color, breed or marking,
        long press on the item in the list and select delete on the confirmation
        popup.
      </Paragraph>
      <Text style={styles.aboutSubtitle}>In conclusion...</Text>
      <Paragraph style={styles.aboutParagraph}>
        I hope you enjoy using myFlock as much as I enjoyed developing it. If
        you wish to contact me, please send an email to {"myflock@gmail.com"}.
        Tips are appreciated at https://paypal.me/vkavun.
      </Paragraph>
    </ScrollView>
  );
};

export default About;

const makeStyles = (theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: "column",
      margin: 20,
    },
    aboutTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.colors.text,
    },
    aboutParagraph: {
      paddingTop: 10,
      fontSize: 15,
      color: theme.colors.text,
    },
    aboutSubtitle: {
      paddingTop: 10,
      fontWeight: "bold",
      fontSize: 16,
      color: theme.colors.text,
    },
  });
