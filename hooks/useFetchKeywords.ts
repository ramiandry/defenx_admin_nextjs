import { MotCle } from '@/type';
import { useState, useEffect } from 'react';


interface UseFetchKeywordsReturn {
  keywords: MotCle[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchKeywords = (): UseFetchKeywordsReturn => {
  const [keywords, setKeywords] = useState<MotCle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:7000/api/mot_cles');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setKeywords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors du fetch des mots-clés:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  return {
    keywords,
    loading,
    error,
    refetch: fetchKeywords,
  };
};