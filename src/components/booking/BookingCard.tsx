import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faClock, faEuroSign } from '@fortawesome/free-solid-svg-icons';
import type { Booking } from '../../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  const getStatusVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed') return 'default';
    if (statusLower === 'cancelled') return 'destructive';
    if (statusLower === 'completed') return 'secondary';
    return 'outline';
  };

  const roomName = booking.roomName || booking.room?.name || 'Salle inconnue';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{roomName}</h3>
          <Badge variant={getStatusVariant(booking.status)}>{getStatusLabel(booking.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <FontAwesomeIcon icon={faCalendarDay} className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Date</span>
          <span className="ml-auto font-medium">
            {new Date(booking.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Horaires</span>
          <span className="ml-auto font-medium">
            {booking.startTime} - {booking.endTime}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Prix</span>
          <span className="ml-auto font-semibold text-primary">{booking.totalPrice}€</span>
        </div>
      </CardContent>
    </Card>
  );
}
