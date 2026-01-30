import { useState, useCallback } from 'react';
import { apiService } from '@/services/api.service';
import type { BookingFormData } from '@/types';

interface CheckoutState {
  loading: boolean;
  error: string | null;
}

export function useStripeCheckout() {
  const [state, setState] = useState<CheckoutState>({
    loading: false,
    error: null,
  });

  const createCheckout = useCallback(async (bookingData: BookingFormData) => {
    setState({ loading: true, error: null });

    try {
      const response = await apiService.createCheckout(bookingData);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create checkout session');
      }

      window.location.href = response.data.sessionUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState({ loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const verifyPayment = useCallback(async (sessionId: string) => {
    setState({ loading: true, error: null });

    try {
      const response = await apiService.verifyPayment(sessionId);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to verify payment');
      }

      setState({ loading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de vérification';
      setState({ loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const calculateRefund = useCallback(async (bookingId: string) => {
    const response = await apiService.calculateRefund(bookingId);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to calculate refund');
    }

    return response.data;
  }, []);

  const requestRefund = useCallback(async (bookingId: string, reason: string) => {
    setState({ loading: true, error: null });

    try {
      const response = await apiService.requestRefund(bookingId, reason);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to request refund');
      }

      setState({ loading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de remboursement';
      setState({ loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return {
    createCheckout,
    verifyPayment,
    calculateRefund,
    requestRefund,
    loading: state.loading,
    error: state.error,
  };
}
