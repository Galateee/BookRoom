import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { Booking } from '../types';

interface UseAdminBookingsResult {
  bookings: Booking[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  updateBookingStatus: (id: string, status: string) => Promise<void>;
}

export function useAdminBookings(): UseAdminBookingsResult {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        throw new Error(response.error?.message || 'Erreur de chargement');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Erreur lors du chargement des réservations')
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string): Promise<void> => {
    try {
      const response = await apiService.cancelBooking(id);
      if (response.success) {
        await fetchBookings();
      } else {
        throw new Error(response.error?.message || "Erreur d'annulation");
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error("Erreur lors de l'annulation de la réservation");
    }
  };

  const updateBookingStatus = async (id: string, status: string): Promise<void> => {
    try {
      const response = await apiService.updateBookingStatus(id, status);
      if (response.success) {
        await fetchBookings();
      } else {
        throw new Error(response.error?.message || 'Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la mise à jour du statut');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    cancelBooking,
    updateBookingStatus,
  };
}
