import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../services/api.service';
import type { Booking, ApiError } from '../types';

interface UseMyBookingsState {
  data: Booking[] | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

export function useMyBookings() {
  const { isSignedIn, isLoaded } = useAuth();
  const [state, setState] = useState<UseMyBookingsState>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const fetchBookings = useCallback(async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setState({
        data: null,
        loading: false,
        error: { code: 'NOT_AUTHENTICATED', message: 'Vous devez être connecté' },
        success: false,
      });
      return;
    }

    setState({ data: null, loading: true, error: null, success: false });

    const response = await apiService.getMyBookings();

    if (response.success && response.data) {
      setState({
        data: response.data,
        loading: false,
        error: null,
        success: true,
      });
    } else {
      setState({
        data: null,
        loading: false,
        error: response.error || { code: 'UNKNOWN', message: 'Erreur inconnue' },
        success: false,
      });
    }
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchBookings().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  };

  return {
    ...state,
    fetchBookings,
    reset,
  };
}
