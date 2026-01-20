import type { Booking } from '../../types';
import './BookingCard.css';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      confirmed: 'Confirmée',
      CONFIRMED: 'Confirmée',
      cancelled: 'Annulée',
      CANCELLED: 'Annulée',
      completed: 'Terminée',
      COMPLETED: 'Terminée',
      MODIFIED: 'Modifiée',
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    return `booking-card__status--${status.toLowerCase()}`;
  };

  // Récupérer le nom de la salle (soit roomName direct, soit via room.name)
  const roomName = booking.roomName || booking.room?.name || 'Salle inconnue';

  return (
    <div className="booking-card">
      <div className="booking-card__header">
        <h3 className="booking-card__room">{roomName}</h3>
        <span className={`booking-card__status ${getStatusClass(booking.status)}`}>
          {getStatusLabel(booking.status)}
        </span>
      </div>
      <div className="booking-card__details">
        <div className="booking-card__detail">
          <span className="booking-card__label">📅 Date</span>
          <span className="booking-card__value">
            {new Date(booking.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="booking-card__detail">
          <span className="booking-card__label">🕐 Horaires</span>
          <span className="booking-card__value">
            {booking.startTime} - {booking.endTime}
          </span>
        </div>
        <div className="booking-card__detail">
          <span className="booking-card__label">💰 Prix</span>
          <span className="booking-card__value">{booking.totalPrice}€</span>
        </div>
      </div>
    </div>
  );
}
