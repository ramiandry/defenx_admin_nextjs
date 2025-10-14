import { AccesBloque } from '@/type';
import { useState, useEffect } from 'react';



interface UseFetchAccesBloquesReturn {
  accesBlockes: AccesBloque[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchAccesBloques = (): UseFetchAccesBloquesReturn => {
  const [accesBlockes, setAccesBlockes] = useState<AccesBloque[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccesBloques = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:7000/api/acces_bloquer');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setAccesBlockes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors du fetch des accès bloqués:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccesBloques();
  }, []);

  return {
    accesBlockes,
    loading,
    error,
    refetch: fetchAccesBloques,
  };
};