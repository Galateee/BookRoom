import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faSpinner,
  faArrowLeft,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BookingCancelled() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/rooms');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faTimesCircle} className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Paiement annulé</h1>
          <p className="text-xl text-muted-foreground">Votre réservation n'a pas été confirmée</p>
        </div>

        {/* Carte d'information */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Que s'est-il passé ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Le processus de paiement a été interrompu. Votre réservation n'a pas été créée et
                  aucun montant n'a été débité.
                </p>
                <p className="text-sm text-muted-foreground">
                  Le créneau que vous aviez sélectionné sera libéré automatiquement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-600" />
              Raisons possibles
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Vous avez cliqué sur le bouton "Retour" de votre navigateur</li>
              <li>• Vous avez fermé la fenêtre de paiement</li>
              <li>• La session de paiement a expiré (30 minutes)</li>
              <li>• Une erreur technique est survenue</li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <Button className="w-full" size="lg" onClick={() => navigate('/rooms')}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" />
            Retour aux salles
          </Button>

          {bookingId && (
            <p className="text-center text-sm text-muted-foreground">
              Référence : {bookingId.slice(0, 8)}...
            </p>
          )}

          {/* Countdown */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                Redirection automatique dans {countdown}s
              </span>
            </div>
          </div>
        </div>

        {/* Aide */}
        <Card className="mt-8 border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Besoin d'aide ?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Si vous rencontrez des difficultés ou si une erreur inattendue s'est produite,
              n'hésitez pas à nous contacter.
            </p>
            <Button variant="outline" size="sm">
              Contacter le support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
