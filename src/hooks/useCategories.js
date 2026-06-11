import { useState, useEffect } from 'react';
import produtoService from '../services/produtoService';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [hasError,   setHasError]   = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await produtoService.getCategories();
      setCategories(data);
    } catch (err) {
      setHasError(err.message || true);
    } finally {
      setIsLoading(false);
    }
  }

  return { categories, isLoading, hasError };
}