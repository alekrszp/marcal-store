import { useState, useEffect } from 'react';
import courseService from '../services/courseService';

export default function useCourses(category = 'Todos') {
  const [courses,   setCourses]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError,  setHasError]  = useState(false);

  useEffect(() => {
    loadCourses();
  }, [category]);

  async function loadCourses() {
    try {
      setIsLoading(true);
      const data = await courseService.getCourses(category);
      setCourses(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return { courses, isLoading, hasError };
}