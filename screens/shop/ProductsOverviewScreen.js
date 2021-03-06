import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  Button,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productActions from "../../store/actions/products";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import Colors from "../../constants/Colors";

export const screenOptions = (props) => {
  return {
    title: "All Products",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            props.navigation.navigate("CartScreen");
          }}
        />
        {/* <CustomHeaderButton /> */}
      </HeaderButtons>
    ),
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        />
        {/* <CustomHeaderButton /> */}
      </HeaderButtons>
    ),
  };
};

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.availableProducts);
  // React.useLayoutEffect(() => {
  //   props.navigation.setOptions({
  //     title: "All Products",
  //     headerRight: () => (
  //       <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
  //         <Item
  //           title="Cart"
  //           iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
  //           onPress={() => {
  //             props.navigation.navigate("CartScreen");
  //           }}
  //         />
  //         {/* <CustomHeaderButton /> */}
  //       </HeaderButtons>
  //     ),
  //     headerLeft: () => (
  //       <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
  //         <Item
  //           title="Menu"
  //           iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
  //           onPress={() => {
  //             props.navigation.toggleDrawer();
  //           }}
  //         />
  //         {/* <CustomHeaderButton /> */}
  //       </HeaderButtons>
  //     ),
  //   });
  // }, [props.navigation]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetails", {
      productId: id,
      productTitle: title,
    });
  };
  //   useEffect(() => {
  //     setIsLoading(true);
  //     dispatch(productActions.fetchProducts()).then(setIsLoading(false));
  //   }, [dispatch]);

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productActions.fetchProducts());
    } catch (e) {
      setError(e.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);
  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", loadProducts);
    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products found</Text>
      </View>
    );
  }
  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

export default ProductsOverviewScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
