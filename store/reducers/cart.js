import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from "../../models/cart-item";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;
      let updateOrNewCartItem;
      if (state.items[addedProduct.id]) {
        updateOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + productPrice
        );
      } else {
        updateOrNewCartItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updateOrNewCartItem },
        totalAmount: state.totalAmount + productPrice,
      };
    case REMOVE_FROM_CART:
      const currentQuantity = state.items[action.pId].quantity;
      let updatedCartItems;
      if (currentQuantity > 1) {
        const updatedCartItem = new CartItem(
          state.items[action.pId].quantity - 1,
          state.items[action.pId].productPrice,
          state.items[action.pId].productTitle,
          state.items[action.pId].sum - state.items[action.pId].productPrice
        );
        updatedCartItems = { ...state.items, [action.pId]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pId];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - state.items[action.pId].productPrice,
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pId]) {
        return state;
      }
      const updateItems = { ...state.items };
      const itemTotal = state.items[action.pId].sum;
      delete updateItems[action.pId];
      return {
        ...state,
        items: updateItems,
        totalAmount: state.totalAmount - itemTotal,
      };
  }
  return state;
};
