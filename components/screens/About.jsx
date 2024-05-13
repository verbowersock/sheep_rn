import { StyleSheet, Text, ScrollView, Linking } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Paragraph, useTheme } from "react-native-paper";
import packageJson from "../../package.json"; // adjust the path as needed

const About = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <ScrollView style={styles.mainContainer}>
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
        To get started, click the <Text style={styles.bold}>plus</Text> button
        on the bottom of the screen and fill out the data for your sheep. You
        can add more colors, breeds and markings as needed right inside the
        form. If you need to remove a color, breed or marking,{" "}
        <Text style={styles.bold}>long press</Text> on the item in the list and
        select delete on the confirmation popup.
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        The sheep can later be edited by clicking on the{" "}
        <Text style={styles.bold}>pencil</Text> icon under the picture.{" "}
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        Medications, vaccinations and weight records can be added by clicking on
        the <Text style={styles.bold}>medical bag</Text> icon in the sheep card.{" "}
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        You can also add last breeding dates and record new lambs for female
        sheep by clicking the <Text style={styles.bold}>heart calendar</Text>{" "}
        icon under the sheep picture.
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        The sheep can be reported dead or sold by clicking the{" "}
        <Text style={styles.bold}>trashcan</Text> icon on the top right.{" "}
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        To see more details about your sheep or export the records into a pdf,
        click the card itself and navigate through different tabs.
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        <Text style={styles.bold}>Overview</Text> tab presents your sheep's
        general information. This data can be edited in the tab by pressing the
        pencil icon button.
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        <Text style={styles.bold}>Breeding</Text> tab reports sheep's sire and
        dam, last breeding date and lambing history for ewes.{" "}
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        <Text style={styles.bold}>Health</Text> tab shows the last medication
        and vaccination administered, as well as the last recorded weight if
        available. Long press on any of those items allows you to add new
        records or view the entire list of recors.
      </Paragraph>
      <Paragraph style={styles.aboutParagraph}>
        <Text style={styles.bold}>Misc</Text> tab contains any notes about the
        sheep or last location for the animal. This information can be edited in
        the tab by pressing the pencil icon button.The sheep can later be edited
        by clicking on the pencil icon under the picture.{" "}
      </Paragraph>

      <Text style={styles.aboutSubtitle}>In conclusion...</Text>
      <Paragraph style={styles.aboutParagraph}>
        I hope you enjoy using myFlock as much as I enjoyed developing it. If
        you wish to contact me, please send an email to{" "}
        {"vbdesignapps@gmail.com"}.
      </Paragraph>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            "https://paypal.me/vkavun?country.x=US&locale.x=en_US"
          )
        }
        style={{ padding: 0, margin: 0 }}
      >
        <Text style={{ color: theme.colors.primary, fontSize: 17 }}>
          Feeling generous? Tip here!
        </Text>
      </TouchableOpacity>
      <Text style={styles.aboutParagraph}>Version {packageJson.version}</Text>
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
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.colors.text,
    },
    aboutParagraph: {
      marginTop: 10,
      fontSize: 17,
      color: theme.colors.text,
    },
    aboutSubtitle: {
      paddingTop: 10,
      fontWeight: "bold",
      fontSize: 19,
      color: theme.colors.text,
    },
    bold: {
      fontWeight: "bold",
    },
  });
