import type { ApiResponse, Room, Booking, BookingFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
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

  async getBookingsByEmail(email: string): Promise<ApiResponse<Booking[]>> {
    const params = new URLSearchParams({ email });
    return this.request<Booking[]>(`/bookings?${params.toString()}`);
  }
}

export const apiService = new ApiService();
