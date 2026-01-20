import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '../hooks/useMyBookings';
import { BookingCard } from '../components/booking/BookingCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import './MyBookings.css';

export function MyBookings() {
  const navigate = useNavigate();
  const { data: bookings, loading, error, fetchBookings } = useMyBookings();

  return (
    <div className="my-bookings">
      <h1 className="my-bookings__title">Mes réservations</h1>

      {loading && <LoadingSpinner message="Chargement de vos réservations..." />}

      {error && !loading && (
        <ErrorMessage
          title="Impossible de récupérer vos réservations"
          message={error.message}
          onRetry={fetchBookings}
        />
      )}

      {!loading && !error && bookings && bookings.length === 0 && (
        <EmptyState
          icon="📅"
          title="Vous n'avez pas encore de réservation"
          message="Commencez par réserver une salle pour voir vos réservations ici."
          actionLabel="Découvrir nos salles"
          onAction={() => navigate('/rooms')}
        />
      )}

      {!loading && !error && bookings && bookings.length > 0 && (
        <div className="my-bookings__list">
          <p className="my-bookings__count">Vous avez {bookings.length} réservation(s)</p>
          <div className="my-bookings__grid">
            {bookings.map((booking) => (
              <BookingCard key={booking.id || booking.bookingId} booking={booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
