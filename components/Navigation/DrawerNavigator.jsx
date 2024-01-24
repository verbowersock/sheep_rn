import { createDrawerNavigator } from "@react-navigation/drawer";
import Header from "../Header";
import BackupRestore from "../screens/BackupRestore";
import MainStackNavigator from "./StackNavigator";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import About from "../screens/About";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      initialRouteName="MainRoute"
      screenOptions={({ navigation }) => ({
        drawerPosition: "right",
        drawerActiveBackgroundColor: theme.colors.secondary,
        drawerActiveTintColor: theme.colors.background,
        drawerInactiveTintColor: theme.colors.text,
        header: () => <Header navigation={navigation} />,
      })}
    >
      <Drawer.Screen
        name="MainRoute"
        component={MainStackNavigator}
        options={{
          drawerLabel: "Your Flock",
          drawerIcon: ({ color, size }) => (
            <Icon name="barn" color={color} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="Backup"
        component={BackupRestore}
        options={{
          drawerLabel: "Backup and Restore",
          drawerIcon: ({ color }) => (
            <Icon name="database-check-outline" color={color} size={25} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{
          drawerLabel: "About the app",
          drawerIcon: ({ color, size }) => (
            <Icon name="help-circle-outline" color={color} size={25} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
