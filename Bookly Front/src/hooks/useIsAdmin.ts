import { useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';

export function useIsAdmin() {
  const { user, isLoaded } = useUser();

  const isAdmin = useMemo(() => {
    if (!isLoaded || !user) return false;
    const role = user.publicMetadata?.role as string | undefined;
    return role === 'admin';
  }, [user, isLoaded]);

  return { isAdmin, loading: !isLoaded };
}
