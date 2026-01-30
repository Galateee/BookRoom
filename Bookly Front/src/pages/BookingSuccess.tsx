import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faSpinner,
  faExclamationTriangle,
  faCalendarCheck,
  faClock,
  faEuroSign,
  faMapMarkerAlt,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import type { Booking } from '@/types';

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment } = useStripeCheckout();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVerified, setHasVerified] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('Session ID manquant');
      setLoading(false);
      return;
    }

    if (hasVerified) {
      return;
    }

    const verify = async () => {
      try {
        setLoading(true);
        setHasVerified(true);
        const result = await verifyPayment(sessionId);
        setBooking(result.booking);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Erreur de vérification');
        setHasVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId, verifyPayment, hasVerified]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <FontAwesomeIcon icon={faSpinner} className="h-16 w-16 text-primary animate-spin mb-6" />
          <h2 className="text-2xl font-bold mb-2">Vérification du paiement...</h2>
          <p className="text-muted-foreground">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="h-16 w-16 text-destructive mb-6"
          />
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p className="text-muted-foreground mb-8">{error || 'Réservation introuvable'}</p>
          <Button onClick={() => navigate('/rooms')}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
            Retour aux salles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faCheckCircle} className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Paiement confirmé !</h1>
          <p className="text-xl text-muted-foreground">
            Votre réservation a été confirmée avec succès
          </p>
        </div>

        {/* Carte de confirmation */}
        <Card className="mb-6">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle>Détails de la réservation</CardTitle>
              <Badge variant="default" className="gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3" />
                Confirmée
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Salle */}
            <div>
              <div className="flex items-start gap-4">
                {booking.room?.imageUrl && (
                  <img
                    src={booking.room.imageUrl}
                    alt={booking.room.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{booking.room?.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 mr-1" />
                    Salle de réunion
                  </div>
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {new Date(booking.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horaire</p>
                  <p className="font-semibold">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FontAwesomeIcon icon={faEuroSign} className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Montant payé</p>
                  <p className="font-semibold text-lg">{booking.totalPrice}€</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="font-semibold">{booking.numberOfPeople} personnes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations importantes */}
        <Card className="mb-6 border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-blue-600" />
              Informations importantes
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Un email de confirmation a été envoyé à {booking.customerEmail}</li>
              <li>• Vous pouvez consulter vos réservations dans la section "Mes réservations"</li>
              <li>
                • Politique d'annulation : Annulation gratuite jusqu'à 48h avant la réservation
              </li>
              <li>• Présentez-vous 5 minutes avant l'heure de début</li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1" onClick={() => navigate('/my-bookings')}>
            Voir mes réservations
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/rooms')}>
            Faire une nouvelle réservation
          </Button>
        </div>
      </div>
    </div>
  );
}
