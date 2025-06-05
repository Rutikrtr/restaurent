import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
  const { item, restaurantId } = action.payload;
  const existingItem = state.cartItems.find(i => i._id === item._id);

  if (existingItem) {
    const updatedCartItems = state.cartItems.map(i =>
      i._id === item._id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
    );
    return { ...state, cartItems: updatedCartItems };
  } else {
    return {
      ...state,
      cartItems: [...state.cartItems, { ...item, quantity: item.quantity || 1, restaurantId }],
    };
  }
}


    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      const updatedCartItems = state.cartItems.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      );
      return { ...state, cartItems: updatedCartItems };
    }

    case 'REMOVE_FROM_CART': {
      const updatedCartItems = state.cartItems.filter(item => item._id !== action.payload);
      return { ...state, cartItems: updatedCartItems };
    }

    case 'CLEAR_CART':
      return { ...state, cartItems: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item, restaurantId) => {
  dispatch({ type: 'ADD_TO_CART', payload: { item, restaurantId } });
};

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
    }
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calculate total items and total price
  const getTotalItems = () => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  // Alias for getTotalPrice to match your existing code
  const getCartTotal = () => {
    return getTotalPrice();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};