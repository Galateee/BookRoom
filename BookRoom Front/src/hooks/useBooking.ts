import { useState } from 'react';
import { apiService } from '../services/api.service';
import type { Booking, BookingFormData, ApiError } from '../types';

interface UseBookingState {
  data: Booking | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

export function useBooking() {
  const [state, setState] = useState<UseBookingState>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const createBooking = async (bookingData: BookingFormData) => {
    setState({ data: null, loading: true, error: null, success: false });

    const response = await apiService.createBooking(bookingData);

    if (response.success && response.data) {
      setState({
        data: response.data,
        loading: false,
        error: null,
        success: true,
      });
      return { success: true, data: response.data };
    } else {
      setState({
        data: null,
        loading: false,
        error: response.error || { code: 'UNKNOWN', message: 'Erreur inconnue' },
        success: false,
      });
      return { success: false, error: response.error };
    }
  };

  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  };

  return { ...state, createBooking, reset };
}
