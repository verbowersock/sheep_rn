import { createStackNavigator } from '@react-navigation/stack';
import Details from '../screens/Details';
import MainScreen from '../screens/MainScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => (
    <Stack.Navigator>
    <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

export default MainStackNavigator;