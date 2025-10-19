"use client"

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthCheckerProps {
  children: React.ReactNode;
}

export function AuthChecker({ children }: AuthCheckerProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Ne rien faire pendant le chargement
    if (isLoading) return;

    console.log('AuthChecker - pathname:', pathname, 'isAuthenticated:', isAuthenticated); // Debug

    // Si on n'est pas sur la page login et pas connecté, rediriger vers login
    if (pathname !== '/login' && isAuthenticated) {
      console.log('Redirection vers /login car non authentifié'); // Debug
      router.replace('/login');
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Afficher un loader pendant la vérification initiale
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Toujours afficher le contenu
  return <>{children}</>;
}