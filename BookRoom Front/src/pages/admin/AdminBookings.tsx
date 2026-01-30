import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCalendarDay,
  faClock,
  faEuroSign,
  faUser,
  faCheck,
  faXmark,
  faFilter,
  faSpinner,
  faExclamationTriangle,
  faSearch,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminBookings } from '@/hooks/useAdminBookings';
import { getStatusLabel, getStatusVariant } from '@/lib/booking-status';
import type { Booking } from '@/types';
import { ModifyBookingDialog } from '@/components/booking/ModifyBookingDialog';

export default function AdminBookings() {
  const {
    bookings: allBookings,
    loading,
    error,
    refetch,
    cancelBooking,
    updateBookingStatus,
    updateBooking,
  } = useAdminBookings();
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'modified' | 'refunded'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'cancel' | 'complete'>('cancel');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [bookingToModify, setBookingToModify] = useState<Booking | null>(null);

  const statusFilteredBookings =
    filter === 'all'
      ? allBookings
      : allBookings.filter((b) => {
          const status = b.status.toLowerCase();
          if (filter === 'modified') return status === 'modified';
          if (filter === 'refunded') return status === 'refunded';
          return status === filter;
        });

  const bookings = searchQuery
    ? statusFilteredBookings.filter((b) => {
        const query = searchQuery.toLowerCase();
        return (
          b.customerName.toLowerCase().includes(query) ||
          b.customerEmail.toLowerCase().includes(query) ||
          b.roomName?.toLowerCase().includes(query)
        );
      })
    : statusFilteredBookings;

  const handleActionClick = (booking: Booking, action: 'cancel' | 'complete') => {
    setSelectedBooking(booking);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking) return;

    setActionLoading(true);
    try {
      if (actionType === 'cancel') {
        await cancelBooking(selectedBooking.id);
      } else {
        await updateBookingStatus(selectedBooking.id, 'COMPLETED');
      }
      setActionDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Erreur lors de l'action:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-16" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="h-16 w-16 text-destructive mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={refetch}>
            <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/admin">
          <Button variant="ghost" className="gap-2 mb-4">
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Retour au dashboard
          </Button>
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Gestion des réservations</h1>
            <p className="text-muted-foreground">{bookings.length} réservations</p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Rechercher par nom, email ou salle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Toutes
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('confirmed')}
          >
            Confirmées
          </Button>
          <Button
            variant={filter === 'modified' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('modified')}
          >
            Modifiées
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('cancelled')}
          >
            Annulées
          </Button>
          <Button
            variant={filter === 'refunded' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('refunded')}
          >
            Remboursées
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{booking.roomName}</CardTitle>
                <Badge variant={getStatusVariant(booking.status)}>
                  {getStatusLabel(booking.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                    <span>Client</span>
                  </div>
                  <div className="font-medium">{booking.customerName}</div>
                  <div className="text-sm text-muted-foreground">{booking.customerEmail}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FontAwesomeIcon icon={faCalendarDay} className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                  <div className="font-medium">
                    {new Date(booking.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                    <span>Horaires</span>
                  </div>
                  <div className="font-medium">
                    {booking.startTime} - {booking.endTime}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4" />
                    <span>Montant</span>
                  </div>
                  <div className="text-lg font-semibold text-primary">{booking.totalPrice}€</div>
                </div>
              </div>

              {['confirmed', 'pending_payment', 'payment_received', 'modified'].some(
                (status) => booking.status.toLowerCase() === status
              ) && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setBookingToModify(booking);
                      setModifyDialogOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                    Modifier
                  </Button>
                  {booking.status.toLowerCase() === 'confirmed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleActionClick(booking, 'complete')}
                    >
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                      Marquer comme terminée
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleActionClick(booking, 'cancel')}
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de confirmation d'action */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'cancel' ? 'Annuler la réservation' : 'Marquer comme terminée'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'cancel'
                ? `Êtes-vous sûr de vouloir annuler la réservation de "${selectedBooking?.roomName}" ?`
                : `Êtes-vous sûr de vouloir marquer la réservation de "${selectedBooking?.roomName}" comme terminée ?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant={actionType === 'cancel' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  En cours...
                </>
              ) : (
                'Confirmer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      {bookingToModify && (
        <ModifyBookingDialog
          open={modifyDialogOpen}
          onOpenChange={setModifyDialogOpen}
          booking={bookingToModify}
          isAdmin={true}
          onUpdateAdmin={updateBooking}
          onSuccess={() => {
            setModifyDialogOpen(false);
            setBookingToModify(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
