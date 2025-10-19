import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Interface pour l'utilisateur
export interface User {
  id: number;
  email: string;
}

// Interface pour les credentials de login
export interface LoginCredentials {
  email: string;
  password: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const API_URL = 'http://localhost:7000/api';

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  // Vérifier l'authentification via session
  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include', // Important pour inclure les cookies de session
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Auth check response:', data); // Debug
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        console.error('Auth check failed:', response.status); // Debug
        setUser(null);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification auth:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de login
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Tentative de login avec:', credentials.email);

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Réponse non-JSON reçue:', text);
        throw new Error('Le serveur a renvoyé une réponse invalide');
      }

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Identifiants incorrects');
      }

      // Sauvegarder les données utilisateur
      setUser(data.user);
      
      console.log('Login réussi, user défini:', data.user);
      
      // Attendre que le state soit mis à jour puis rediriger
      setTimeout(() => {
        console.log('Redirection vers /');
        router.push('/');
        router.refresh();
      }, 100);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      console.error('Erreur de login:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Fonction de logout
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      console.log('Tentative de logout'); // Debug
      
      // Appeler l'API de logout
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Important pour détruire la session
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Nettoyer l'état
      setUser(null);
      setError(null);
      
      console.log('Logout réussi, redirection vers /login'); // Debug
      
      // Rediriger vers la page de login
      router.push('/login');
      router.refresh(); // Forcer le rafraîchissement
    } catch (err) {
      console.error('Erreur lors du logout:', err);
      // Même en cas d'erreur, on déconnecte localement
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Fonction pour effacer les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};