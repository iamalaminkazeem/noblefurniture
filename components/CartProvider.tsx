"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = { productId: string; name: string; priceKobo: number; image: string; quantity: number };

type CartContextType = {
  items: CartItem[];
  count: number;
  totalKobo: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "nfg-cart";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted cart data
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...item, quantity }];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalKobo = items.reduce((sum, i) => sum + i.priceKobo * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, totalKobo, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}
