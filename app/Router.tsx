import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePage } from './pages';


const Stack = createNativeStackNavigator();

export function Router() {
  return (
    <NavigationContainer>
      < Stack.Navigator
        screenOptions={{ headerShown: false }}
        children={
          <>
            <Stack.Screen name='home' component={HomePage} />
          </>
        }
      />
    </NavigationContainer>
  )
}





