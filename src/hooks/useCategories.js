import { useState, useEffect } from 'react';
import courseService from '../services/courseService';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [hasError,   setHasError]   = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await courseService.getCategories();
      setCategories(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return { categories, isLoading, hasError };
}