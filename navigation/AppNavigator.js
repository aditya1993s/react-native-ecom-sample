import { StyleSheet } from "react-native";
import React from "react";
import { ShopNavigator, AuthNavigator } from "./ShopNavigator";
import StarupScreen from "../screens/StarupScreen";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => !!state.auth.didTryAutoLogin);
  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StarupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
