import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api.service';
import type { Room } from '../types';

interface UseAdminRoomsResult {
  rooms: Room[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createRoom: (roomData: Partial<Room>) => Promise<Room>;
  updateRoom: (id: string, roomData: Partial<Room>) => Promise<Room>;
  deleteRoom: (id: string) => Promise<void>;
  toggleRoomStatus: (id: string) => Promise<void>;
}

export function useAdminRooms(): UseAdminRoomsResult {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllRoomsAdmin();
      if (response.success && response.data) {
        setRooms(response.data);
      } else {
        throw new Error(response.error?.message || 'Erreur de chargement');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des salles'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = async (roomData: Partial<Room>): Promise<Room> => {
    try {
      const response = await apiService.createRoom(roomData as Omit<Room, 'id'>);
      if (response.success && response.data) {
        await fetchRooms();
        return response.data;
      }
      throw new Error(response.error?.message || 'Erreur de création');
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la création de la salle');
    }
  };

  const updateRoom = async (id: string, roomData: Partial<Room>): Promise<Room> => {
    try {
      const response = await apiService.updateRoom(id, roomData);
      if (response.success && response.data) {
        await fetchRooms();
        return response.data;
      }
      throw new Error(response.error?.message || 'Erreur de mise à jour');
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la mise à jour de la salle');
    }
  };

  const deleteRoom = async (id: string): Promise<void> => {
    try {
      const response = await apiService.deleteRoom(id);
      if (response.success) {
        await fetchRooms();
      } else {
        throw new Error(response.error?.message || 'Erreur de suppression');
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la suppression de la salle');
    }
  };

  const toggleRoomStatus = async (id: string): Promise<void> => {
    try {
      const response = await apiService.toggleRoomStatus(id);
      if (response.success) {
        await fetchRooms();
      } else {
        throw new Error(response.error?.message || 'Erreur de changement de statut');
      }
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error('Erreur lors du changement de statut de la salle');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    toggleRoomStatus,
  };
}
