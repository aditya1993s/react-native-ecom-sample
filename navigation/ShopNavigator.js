import { createStackNavigator } from "@react-navigation/stack";
import ProductsOverviewScreen, {
  screenOptions,
} from "../screens/shop/ProductsOverviewScreen";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Colors from "../constants/Colors";
import { Platform, View, SafeAreaView, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductsDetailsScreen from "../screens/shop/ProductsDetailsScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import React from "react";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

let isLoggedIn = false;
const defaultOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};
const ProductsStackNavigator = createStackNavigator();
export const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultOptions}>
      <ProductsStackNavigator.Screen
        name="Products Overview"
        component={ProductsOverviewScreen}
        options={screenOptions}
      />
      <ProductsStackNavigator.Screen
        name="ProductDetails"
        component={ProductsDetailsScreen}
      />
      <ProductsStackNavigator.Screen name="CartScreen" component={CartScreen} />
    </ProductsStackNavigator.Navigator>
  );
};

const OrderStackNavigator = createStackNavigator();
export const OrderNavigator = () => {
  return (
    <OrderStackNavigator.Navigator screenOptions={defaultOptions}>
      <OrderStackNavigator.Screen name="Orders_" component={OrdersScreen} />
    </OrderStackNavigator.Navigator>
  );
};

const AdminStackNavigator = createStackNavigator();
export const AdminNavigator = () => {
  return (
    <AdminStackNavigator.Navigator screenOptions={defaultOptions}>
      <AdminStackNavigator.Screen
        name="UserProducts"
        component={UserProductsScreen}
      />
      <AdminStackNavigator.Screen
        name="EditProducts"
        component={EditProductScreen}
      />
    </AdminStackNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultOptions}>
      <AuthStackNavigator.Screen name="AuthScreen" component={AuthScreen} />
    </AuthStackNavigator.Navigator>
  );
};

const ShopDrawerNavigator = createDrawerNavigator();
export const ShopNavigator = () => {
  const dispatch = useDispatch();
  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <View style={{ paddingTop: 20 }}>
              <Button
                title="Logout"
                color={Colors.primary}
                onPress={() => {
                  dispatch(authActions.logout());
                  // props.navigation.navigate("Auth");
                }}
              />
            </View>
          </DrawerContentScrollView>
        );
      }}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Colors.primary,
        drawerItemStyle: {
          fontFamily: "open-sans-bold",
        },
        drawerStyle: {
          // backgroundColor: "#c6cbef",
          width: 240,
        },
        drawerLabelStyle: {
          // color: "white",
        },
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Orders"
        component={OrderNavigator}
        options={{
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-list" : "ios-list"}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-create" : "ios-create"}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};

const mainNavigator = () => {
  return (
    <NavigationContainer>
      {!isLoggedIn ? <ShopNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default mainNavigator;
