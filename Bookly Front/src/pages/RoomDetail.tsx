import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUsers,
  faEuroSign,
  faCheck,
  faLock,
  faCircleCheck,
  faCalendarCheck,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { useRoom } from '../hooks/useRoom';
import { BookingForm } from '../components/booking/BookingForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { data: room, loading, error, refetch } = useRoom(id);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.code === 'ROOM_NOT_FOUND') {
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="h-16 w-16 text-muted-foreground mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Salle introuvable</h2>
            <p className="text-muted-foreground mb-6">
              Cette salle n'existe pas ou n'est plus disponible
            </p>
            <Button onClick={() => navigate('/rooms')}>
              <FontAwesomeIcon icon={faHome} className="h-4 w-4 mr-2" />
              Retour aux salles
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={refetch}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  const handleBookingSuccess = () => {
    setShowSuccessModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <FontAwesomeIcon icon={faCircleCheck} className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Réservation confirmée !</DialogTitle>
            <DialogDescription className="text-center">
              Votre réservation pour <strong>{room.name}</strong> a été confirmée. Un email de
              confirmation vous a été envoyé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button onClick={() => navigate('/my-bookings')}>
              <FontAwesomeIcon icon={faCalendarCheck} className="h-4 w-4 mr-2" />
              Voir mes réservations
            </Button>
            <Button variant="outline" onClick={() => navigate('/rooms')}>
              <FontAwesomeIcon icon={faHome} className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="ghost" onClick={() => navigate('/rooms')} className="mb-6">
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative h-96 rounded-lg overflow-hidden bg-muted">
            <img
              src={room.imageUrl || '/placeholder-room.webp'}
              alt={room.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-room.webp';
              }}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{room.name}</h1>

            {room.description && (
              <p className="text-lg text-muted-foreground mb-6">{room.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capacité</p>
                      <p className="text-lg font-semibold">{room.capacity} personnes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <FontAwesomeIcon icon={faEuroSign} className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prix</p>
                      <p className="text-lg font-semibold">{room.pricePerHour}€/heure</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Équipements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {room.equipments.map((equipment) => (
                    <Badge key={equipment} variant="secondary" className="gap-1.5">
                      <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          {isSignedIn ? (
            <BookingForm room={room} onSuccess={handleBookingSuccess} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FontAwesomeIcon icon={faLock} className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Vous devez être connecté pour réserver cette salle.
                  </p>
                </div>
                <SignInButton mode="modal" fallbackRedirectUrl={window.location.pathname}>
                  <Button className="w-full">Se connecter</Button>
                </SignInButton>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
