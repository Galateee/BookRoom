import type { ApiResponse, Room, Booking, BookingFormData, StripeSession } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let getAuthToken: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  getAuthToken = getter;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      // Récupérer le token Clerk si disponible
      const token = getAuthToken ? await getAuthToken() : null;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
      };

      // Ajouter le token d'authentification si disponible
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        credentials: 'include',
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Impossible de contacter le serveur',
        },
      };
    }
  }

  async getRooms(): Promise<ApiResponse<Room[]>> {
    return this.request<Room[]>('/rooms');
  }

  async getRoomById(id: string): Promise<ApiResponse<Room>> {
    return this.request<Room>(`/rooms/${id}`);
  }

  async createBooking(bookingData: BookingFormData): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>('/bookings/my-bookings');
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  }

  // Admin endpoints
  async getAllRoomsAdmin(): Promise<ApiResponse<Room[]>> {
    return this.request<Room[]>('/admin/rooms');
  }

  async createRoom(roomData: Omit<Room, 'id'>): Promise<ApiResponse<Room>> {
    return this.request<Room>('/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async updateRoom(roomId: string, roomData: Partial<Room>): Promise<ApiResponse<Room>> {
    return this.request<Room>(`/admin/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  }

  async deleteRoom(roomId: string): Promise<ApiResponse<Room>> {
    return this.request<Room>(`/admin/rooms/${roomId}`, {
      method: 'DELETE',
    });
  }

  async toggleRoomStatus(roomId: string): Promise<ApiResponse<Room>> {
    return this.request<Room>(`/admin/rooms/${roomId}/toggle`, {
      method: 'PATCH',
    });
  }

  async getAllBookings(filters?: {
    status?: string;
    roomId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Booking[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.roomId) params.append('roomId', filters.roomId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Booking[]>(`/admin/bookings${query}`);
  }

  async getStatistics(): Promise<
    ApiResponse<{
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
    }>
  > {
    return this.request('/admin/statistics');
  }

  async updateBookingStatus(id: string, status: string): Promise<ApiResponse<Booking>> {
    return this.request(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Payment endpoints
  async createCheckout(
    bookingData: BookingFormData
  ): Promise<ApiResponse<{ bookingId: string; sessionId: string; sessionUrl: string }>> {
    return this.request('/payment/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ bookingData }),
    });
  }

  async verifyPayment(
    sessionId: string
  ): Promise<ApiResponse<{ booking: Booking; session: StripeSession }>> {
    return this.request(`/payment/verify/${sessionId}`);
  }

  async requestRefund(
    bookingId: string,
    reason: string
  ): Promise<ApiResponse<{ refundAmount: number; refundPercentage: number; refundId: string }>> {
    return this.request('/payment/refund', {
      method: 'POST',
      body: JSON.stringify({ bookingId, reason }),
    });
  }

  async calculateRefund(bookingId: string): Promise<
    ApiResponse<{
      totalPrice: number;
      refundAmount: number;
      refundPercentage: number;
      canRefund: boolean;
    }>
  > {
    return this.request('/payment/calculate-refund', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });
  }
}

export const apiService = new ApiService();
