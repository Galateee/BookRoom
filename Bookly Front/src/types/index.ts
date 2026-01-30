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
  totalPrice?: number;
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
    | 'PENDING_PAYMENT'
    | 'PAYMENT_PROCESSING'
    | 'PAYMENT_RECEIVED'
    | 'CONFIRMED'
    | 'CHECKED_IN'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED_BY_USER'
    | 'CANCELLED_BY_ADMIN'
    | 'CANCELLED_NO_PAYMENT'
    | 'NO_SHOW'
    | 'REFUNDED'
    | 'MODIFIED'
    // Support des anciennes valeurs lowercase pour compatibilité
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

export interface StripeSession {
  id: string;
  status: string;
  payment_status: string;
  customer_email?: string;
  amount_total?: number;
  currency?: string;
}
