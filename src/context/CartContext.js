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

  // Cada curso só pode estar uma vez no carrinho (não é possível comprar
  // mais de 1 unidade do mesmo curso). Retorna false se o produto já estiver
  // no carrinho, para a tela poder avisar o usuário.
  async function addItem(produto) {
    const jaExiste = items.some(item => item.id === produto.id);
    if (jaExiste) return false;

    const updatedItems = [...items, {
      id:       produto.id,
      title:    produto.title,
      mentor:   produto.mentor,
      price:    produto.price,
      image:    produto.image,
      quantity: 1,
    }];

    await persist(updatedItems);
    return true;
  }

  async function removeItem(id) {
    await persist(items.filter(item => item.id !== id));
  }

  async function clearCart() {
    await persist([]);
  }

  const itemCount = items.length;
  const total     = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{
      items, itemCount, total, isLoading,
      addItem, removeItem, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}
