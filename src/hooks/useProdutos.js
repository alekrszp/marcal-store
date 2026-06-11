import { useState, useEffect, useCallback } from 'react';
import produtoService from '../services/produtoService';

export default function useProdutos(category = 'Todos') {
  const [produtos,  setProdutos]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);

  const loadProdutos = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const data = await produtoService.getProdutos(category);
      setProdutos(data);
    } catch (err) {
      setHasError(err.message || true);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadProdutos();
  }, [loadProdutos]);

  return { produtos, isLoading, hasError, reload: loadProdutos };
}
