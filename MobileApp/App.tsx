import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import PredictWind from "./components/PredictWind";
import PredictRemedy from "./components/PredictRemedy";
import PredictSeverity from "./components/PredictSeverity";
import { firebase } from "./config";
import OnBoardScreen from "./src/views/screens/OnBoardScreen";
import Login from "./src/Login";
import Registration from "./src/Registration";
import Dashboard from "./src/Dashboard";
import HomeScreen from "./src/views/screens/HomeScreen";
import COLORS from "./consts/colors";
import { StyleSheet } from 'react-native';
import EarlyRisk from "./components/EarlyRisk";


const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  //handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  {

  }


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen
          name="OnBoardScreen"
          component={OnBoardScreen}
          options={{
            headerTransparent: true,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />

        <Stack.Screen
          name="Registration"
          component={Registration}
        />

        <Stack.Screen name="Dashboard" component={Dashboard} />

        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerTransparent: true,
            headerShown: false,
          }}
        />

        <Stack.Screen name="PredictRemedy" component={PredictRemedy} />
        <Stack.Screen name="PredictSeverity" component={PredictSeverity} />
        <Stack.Screen name="PredictWind" component={PredictWind} />
        <Stack.Screen name="EarlyRisk" component={EarlyRisk} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 150,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: COLORS.green,
    shadowColor: "#000",
    elevation: 25,
  },
})

export default App