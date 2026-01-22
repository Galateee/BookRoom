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
  isActive?: boolean;
  bookedSlots?: BookedSlot[];
}

export interface BookedSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
}

export interface DayAvailability {
  date: string;
  dayOfWeek: string;
  timeSlots: TimeSlot[];
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
  id: string;
  bookingId?: string; // Alias pour compatibilité
  roomId: string;
  roomName?: string;
  room?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  numberOfPeople: number;
  totalPrice: number;
  status:
    | 'CONFIRMED'
    | 'MODIFIED'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'confirmed'
    | 'cancelled'
    | 'completed';
  createdAt?: string;
  updatedAt?: string;
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
