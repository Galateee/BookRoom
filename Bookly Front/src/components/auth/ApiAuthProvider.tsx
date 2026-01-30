import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { setAuthTokenGetter } from '../../services/api.service';

/**
 * Composant qui configure le getter de token Clerk pour l'API service.
 * Doit être placé à l'intérieur du ClerkProvider.
 */
export function ApiAuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    // Configure le getter de token pour le service API
    setAuthTokenGetter(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
  }, [getToken]);

  return <>{children}</>;
}
