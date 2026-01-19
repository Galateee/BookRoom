// Types pour l'application de réservation

export interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  equipments: string[];
  imageUrl: string;
  description?: string;
  images?: string[];
  availableSlots?: AvailableSlot[];
}

export interface AvailableSlot {
  date: string;
  slots: string[];
}

export interface BookingFormData {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
}

export interface Booking {
  bookingId: string;
  roomId?: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName?: string;
  customerEmail?: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    total: number;
  };
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}
