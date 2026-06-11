import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/orderService';
import produtoService from '../services/produtoService';

// INTEGRAÇÃO: hoje "meus cursos" é calculado no app cruzando o histórico de
// pedidos (GET /api/orders) com o catálogo (GET /api/produtos), filtrando os
// produtos com "video" cujo id apareça em algum pedido do usuário.
// Futuramente o backend pode expor um endpoint dedicado, ex:
// GET /api/my-courses → Array<Produto> (somente produtos comprados que têm vídeo)
export default function useMeusCursos() {
  const [cursos,    setCursos]    = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);

  const loadCursos = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const [orders, produtos] = await Promise.all([
        orderService.getOrders(),
        produtoService.getProdutos('Todos'),
      ]);

      const comprados = new Set(orders.flatMap(order => order.items.map(item => item.id)));
      setCursos(produtos.filter(p => comprados.has(p.id) && p.video));
    } catch (err) {
      setHasError(err.message || true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCursos();
  }, [loadCursos]);

  return { cursos, isLoading, hasError, reload: loadCursos };
}
