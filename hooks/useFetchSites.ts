import { SiteBloque } from '@/type';
import { useState, useEffect } from 'react';


interface UseFetchSitesReturn {
  sites: SiteBloque[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchSites = (): UseFetchSitesReturn => {
  const [sites, setSites] = useState<SiteBloque[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:7000/api/site_bloquer');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setSites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors du fetch des sites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return {
    sites,
    loading,
    error,
    refetch: fetchSites,
  };
};