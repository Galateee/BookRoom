import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faClock,
  faEuroSign,
  faBan,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import type { Booking } from '../../types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getStatusLabel,
  getStatusVariant,
  canCancelBooking,
  canModifyBooking,
} from '@/lib/booking-status';
import { apiService } from '@/services/api.service';
import { ModifyBookingDialog } from './ModifyBookingDialog';

interface BookingCardProps {
  booking: Booking;
  onUpdate?: () => void;
}

export function BookingCard({ booking, onUpdate }: BookingCardProps) {
  const roomName = booking.roomName || booking.room?.name || 'Salle inconnue';
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [refundInfo, setRefundInfo] = useState<{
    totalPrice: number;
    refundAmount: number;
    refundPercentage: number;
    canRefund: boolean;
  } | null>(null);
  const [loadingRefund, setLoadingRefund] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const bookingId = booking.id || booking.bookingId || '';
  const bookingDate = new Date(booking.date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastBooking = bookingDate < today;
  const canCancel = canCancelBooking(booking) && !isPastBooking;
  const canModify = canModifyBooking(booking) && !isPastBooking;

  const handleCancelClick = async () => {
    setCancelDialogOpen(true);
    setLoadingRefund(true);
    setCancelError(null);

    try {
      const response = await apiService.calculateRefund(bookingId);
      if (response.success && response.data) {
        setRefundInfo(response.data);
      } else {
        setCancelError(response.error?.message || 'Impossible de calculer le remboursement');
      }
    } catch {
      setCancelError('Erreur lors du calcul du remboursement');
    } finally {
      setLoadingRefund(false);
    }
  };

  const handleConfirmCancel = async () => {
    setCancelling(true);
    setCancelError(null);

    try {
      const response = await apiService.requestRefund(bookingId, "Annulation par l'utilisateur");

      if (response.success) {
        setCancelSuccess(true);
        setTimeout(() => {
          setCancelDialogOpen(false);
          setCancelSuccess(false);
          onUpdate?.();
        }, 2000);
      } else {
        setCancelError(response.error?.message || "Erreur lors de l'annulation");
      }
    } catch {
      setCancelError("Erreur lors de l'annulation de la réservation");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{roomName}</h3>
            <Badge variant={getStatusVariant(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
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

        {(canCancel || canModify) && (
          <CardFooter className="pt-0 gap-2">
            {canModify && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setModifyDialogOpen(true)}
              >
                <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={handleCancelClick}
              >
                <FontAwesomeIcon icon={faBan} className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Dialog d'annulation */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cancelSuccess ? 'Réservation annulée' : "Confirmer l'annulation"}
            </DialogTitle>
            <DialogDescription>
              {cancelSuccess ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-center">
                    Votre réservation a été annulée avec succès.
                    {refundInfo && refundInfo.refundAmount > 0 && (
                      <>
                        <br />
                        <span className="font-semibold text-green-600">
                          Remboursement de {refundInfo.refundAmount}€ en cours.
                        </span>
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-4">
                    Êtes-vous sûr de vouloir annuler votre réservation pour{' '}
                    <strong>{roomName}</strong> le{' '}
                    {new Date(booking.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    ?
                  </p>

                  {loadingRefund && (
                    <div className="flex items-center justify-center py-4">
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="h-6 w-6 animate-spin text-primary"
                      />
                      <span className="ml-2">Calcul du remboursement...</span>
                    </div>
                  )}

                  {!loadingRefund && refundInfo && (
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <h4 className="font-semibold">Informations de remboursement</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Prix total :</span>
                          <span className="font-medium">{refundInfo.totalPrice}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux de remboursement :</span>
                          <span className="font-medium">{refundInfo.refundPercentage}%</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-semibold">Montant remboursé :</span>
                          <span className="font-semibold text-primary">
                            {refundInfo.refundAmount}€
                          </span>
                        </div>
                      </div>

                      {refundInfo.refundPercentage === 100 && (
                        <p className="text-xs text-green-600 mt-2">
                          Annulation gratuite (plus de 48h avant la réservation)
                        </p>
                      )}
                      {refundInfo.refundPercentage === 50 && (
                        <p className="text-xs text-orange-600 mt-2">
                          Remboursement partiel (entre 24h et 48h avant)
                        </p>
                      )}
                      {refundInfo.refundPercentage === 0 && (
                        <p className="text-xs text-red-600 mt-2">
                          Aucun remboursement (moins de 24h avant)
                        </p>
                      )}
                    </div>
                  )}

                  {cancelError && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg flex items-start gap-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 mt-0.5" />
                      <span className="text-sm">{cancelError}</span>
                    </div>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {!cancelSuccess && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
                disabled={cancelling}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={cancelling || loadingRefund || !refundInfo}
              >
                {cancelling ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                    Annulation...
                  </>
                ) : (
                  "Confirmer l'annulation"
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <ModifyBookingDialog
        open={modifyDialogOpen}
        onOpenChange={setModifyDialogOpen}
        booking={booking}
        onSuccess={onUpdate}
      />
    </>
  );
}
