import React, { createContext, useContext, useState } from 'react';
import type { MenuItem, OrderItem } from '../types/index';

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getOrderItems: () => OrderItem[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (menuItem: MenuItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.menuItem.menuItemId === menuItem.menuItemId);
      if (existingItem) {
        return currentItems.map(item =>
          item.menuItem.menuItemId === menuItem.menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { menuItem, quantity: 1 }];
    });
  };

  const removeItem = (itemId: number) => {
    setItems(currentItems =>
      currentItems.filter(item => item.menuItem.menuItemId !== itemId)
    );
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.menuItem.menuItemId === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.menuItem.menuItemPrice * item.quantity), 0);

  const getOrderItems = (): OrderItem[] => {
    return items.map(item => ({
      menuItemId: item.menuItem.menuItemId,
      quantity: item.quantity
    }));
  };

  return (
    <CartContext.Provider value={{
      items,
      setItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      getOrderItems
    }}>
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

export type { CartContextType };
