import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { Booking, ApiError } from '../types';

interface UseMyBookingsState {
  data: Booking[] | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

export function useMyBookings() {
  const [state, setState] = useState<UseMyBookingsState>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const fetchBookings = async (email: string) => {
    if (!email || !email.includes('@')) {
      setState({
        data: null,
        loading: false,
        error: { code: 'INVALID_EMAIL', message: 'Email invalide' },
        success: false,
      });
      return;
    }

    setState({ data: null, loading: true, error: null, success: false });

    const response = await apiService.getBookingsByEmail(email);

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
  };

  return { ...state, fetchBookings };
}
