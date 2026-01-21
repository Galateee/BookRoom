import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { Room, ApiError } from '../types';

interface UseRoomsState {
  data: Room[] | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

export function useRooms() {
  const [state, setState] = useState<UseRoomsState>({
    data: null,
    loading: true,
    error: null,
    success: false,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setState({ data: null, loading: true, error: null, success: false });

      const startTime = Date.now();
      const response = await apiService.getRooms();
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

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

    fetchRooms();
  }, []);

  const refetch = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const response = await apiService.getRooms();

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

  return { ...state, refetch };
}
