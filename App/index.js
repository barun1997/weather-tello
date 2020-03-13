import React from "react";
import { TouchableOpacity, Image, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Details from "./screens/Details";
import Search from "./screens/Search";

const AppStack = createStackNavigator();

const HeaderRightButton = ({ onPress, style, icon }) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={icon}
      resizeMode="contain"
      style={[
        {
          marginRight: 10,
          width: 20,
          height: 20,
          tintColor: "#fff"
        },
        style
      ]}
    />
  </TouchableOpacity>
);

export default function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator initialRouteName="Search" mode="modal">
        <AppStack.Screen
          name="Details"
          component={Details}
          options={({ navigation, route }) => ({
            headerTitle: route.params?.title ?? "",
            headerStyle: {
              backgroundColor: "#3145b7",
              borderBottomColor: "#3145b7"
            },
            headerTintColor: "#fff",
            headerRight: () => (
              <>
                <StatusBar barStyle="light-content" />
                <HeaderRightButton
                  onPress={() => navigation.navigate("Search")}
                  icon={require("./assets/search.png")}
                />
              </>
            )
          })}
        />

        <AppStack.Screen
          name="Search"
          component={Search}
          options={({ navigation }) => ({
            headerTitle: "Search",
            headerRight: () => (
              <>
                <StatusBar barStyle="dark-content" />
                <HeaderRightButton
                  style={{ tintColor: "#000" }}
                  onPress={() => navigation.pop()}
                  icon={require("./assets/close.png")}
                />
              </>
            ),
            headerLeft: null
          })}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
