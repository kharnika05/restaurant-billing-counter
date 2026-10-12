import React, { createContext, useContext, useState } from 'react';
import { MenuItem, OrderType, RestaurantTable } from '../types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  selectedTable: RestaurantTable | null;
  customerName: string;
  customerPhone: string;
  notes: string;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, delta: number) => void;
  setOrderType: (type: OrderType) => void;
  setSelectedTable: (table: RestaurantTable | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const addItem = (menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeItem = (itemId: number) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.menuItem.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedTable(null);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const taxAmount = Number((subtotal * 0.05).toFixed(2));
  const grandTotal = Number((subtotal + taxAmount).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        selectedTable,
        customerName,
        customerPhone,
        notes,
        subtotal,
        taxAmount,
        grandTotal,
        addItem,
        removeItem,
        updateQuantity,
        setOrderType,
        setSelectedTable,
        setCustomerName,
        setCustomerPhone,
        setNotes,
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
