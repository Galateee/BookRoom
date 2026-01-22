import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faDoorOpen,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { useMyBookings } from '../hooks/useMyBookings';
import { BookingCard } from '../components/booking/BookingCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MyBookings() {
  const navigate = useNavigate();
  const { data: bookings, loading, error, fetchBookings } = useMyBookings();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Mes réservations</h1>
        {bookings && bookings.length > 0 && (
          <p className="text-muted-foreground">
            Vous avez {bookings.length} réservation{bookings.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {error && !loading && (
        <div className="max-w-md mx-auto text-center py-16">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="h-16 w-16 text-destructive mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Impossible de récupérer vos réservations</h2>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={fetchBookings}>Réessayer</Button>
        </div>
      )}

      {!loading && !error && bookings && bookings.length === 0 && (
        <div className="max-w-md mx-auto text-center py-16">
          <FontAwesomeIcon icon={faCalendarDays} className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Vous n'avez pas encore de réservation</h2>
          <p className="text-muted-foreground mb-6">
            Commencez par réserver une salle pour voir vos réservations ici.
          </p>
          <Button onClick={() => navigate('/rooms')}>
            <FontAwesomeIcon icon={faDoorOpen} className="h-4 w-4 mr-2" />
            Découvrir nos salles
          </Button>
        </div>
      )}

      {!loading && !error && bookings && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id || booking.bookingId} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
