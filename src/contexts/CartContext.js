import React, { createContext, useContext, useReducer, useMemo } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product._id === product._id
      );
      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, { product, quantity }] };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product._id !== action.payload
        ),
      };
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product._id !== productId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [state.items]
  );

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
