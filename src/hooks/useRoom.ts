import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { Room, ApiError } from '../types';

interface UseRoomState {
  data: Room | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

export function useRoom(id: string | undefined) {
  const [state, setState] = useState<UseRoomState>(() => ({
    data: null,
    loading: id ? true : false,
    error: id ? null : { code: 'INVALID_ID', message: 'ID invalide' },
    success: false,
  }));

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchRoom = async () => {
      setState({ data: null, loading: true, error: null, success: false });

      const response = await apiService.getRoomById(id);

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

    fetchRoom();
  }, [id]);

  const refetch = async () => {
    if (!id) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    const response = await apiService.getRoomById(id);

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
