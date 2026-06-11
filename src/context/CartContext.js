import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items,     setItems]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const data = await cartService.getCart();
      setItems(data);
    } catch (err) {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function persist(updatedItems) {
    setItems(updatedItems);
    await cartService.saveCart(updatedItems);
  }

  async function addItem(produto) {
    const existente = items.find(item => item.id === produto.id);

    const updatedItems = existente
      ? items.map(item => (
          item.id === produto.id ? { ...item, quantity: item.quantity + 1 } : item
        ))
      : [...items, {
          id:       produto.id,
          title:    produto.title,
          mentor:   produto.mentor,
          price:    produto.price,
          image:    produto.image,
          quantity: 1,
        }];

    await persist(updatedItems);
  }

  async function removeItem(id) {
    await persist(items.filter(item => item.id !== id));
  }

  async function updateQuantity(id, quantity) {
    if (quantity < 1) {
      await removeItem(id);
      return;
    }

    const updatedItems = items.map(item => (
      item.id === id ? { ...item, quantity } : item
    ));
    await persist(updatedItems);
  }

  async function clearCart() {
    await persist([]);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total     = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, itemCount, total, isLoading,
      addItem, removeItem, updateQuantity, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}
