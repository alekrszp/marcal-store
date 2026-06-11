import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/orderService';

export default function useOrders() {
  const [orders,    setOrders]    = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      setHasError(err.message || true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return { orders, isLoading, hasError, reload: loadOrders };
}
