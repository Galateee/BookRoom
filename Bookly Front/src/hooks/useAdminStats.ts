import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

interface AdminStats {
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  monthlyGrowth: number;
  topRooms: Array<{
    id: string;
    name: string;
    imageUrl: string;
    bookings: number;
  }>;
}

interface UseAdminStatsResult {
  stats: AdminStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAdminStats(): UseAdminStatsResult {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getStatistics();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(
          response.error?.message || 'Erreur lors de la récupération des statistiques'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Erreur lors du chargement des statistiques')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
