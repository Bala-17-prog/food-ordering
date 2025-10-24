import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.find((cartItem) => cartItem.id === item.id);
      if (isItemInCart) {
        // Increase quantity if item exists
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item with quantity 1
        // We ensure the item object passed to cart has quantity property
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.id !== itemId)
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider 
        value={{ 
            // FIX: Expose the state as 'cart' for consumption in other components
            cart: cartItems, 
            addToCart, 
            removeFromCart, 
            clearCart 
        }}
    >
      {children}
    </CartContext.Provider>
  );
};