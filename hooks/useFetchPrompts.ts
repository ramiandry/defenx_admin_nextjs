import { Prompt } from '@/type';
import { useState, useEffect } from 'react';

// Type basé sur la structure réelle de votre API

interface UsePromptsReturn {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchPrompts = (): UsePromptsReturn => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:7000/api/prompts');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setPrompts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors du fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  return {
    prompts,
    loading,
    error,
    refetch: fetchPrompts,
  };
};