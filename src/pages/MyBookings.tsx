import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyBookings } from '../hooks/useMyBookings';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { BookingCard } from '../components/booking/BookingCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import './MyBookings.css';

export function MyBookings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { data: bookings, loading, error, fetchBookings } = useMyBookings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("L'email est requis");
      return;
    }

    if (!email.includes('@')) {
      setEmailError("Format d'email invalide");
      return;
    }

    setEmailError('');
    fetchBookings(email);
  };

  const handleRetry = () => {
    if (email && email.includes('@')) {
      fetchBookings(email);
    }
  };

  return (
    <div className="my-bookings">
      <h1 className="my-bookings__title">Mes réservations</h1>

      <div className="my-bookings__search">
        <form onSubmit={handleSubmit} className="my-bookings__form">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setEmailError('');
            }}
            error={emailError}
            placeholder="votre.email@example.com"
            required
            disabled={loading}
          />
          <Button type="submit" disabled={!email || loading} loading={loading}>
            Consulter
          </Button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Chargement de vos réservations..." />}

      {error && !loading && (
        <ErrorMessage
          title="Impossible de récupérer vos réservations"
          message={error.message}
          onRetry={handleRetry}
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
              <BookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
