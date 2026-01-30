import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Booking, Room } from '@/types';
import { apiService } from '@/services/api.service';
import { SlotPicker } from './SlotPicker';

interface ModifyBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  onSuccess?: () => void;
  isAdmin?: boolean;
  onUpdateAdmin?: (
    id: string,
    data: { date?: string; startTime?: string; endTime?: string; numberOfPeople?: number }
  ) => Promise<void>;
}

export function ModifyBookingDialog({
  open,
  onOpenChange,
  booking,
  onSuccess,
  isAdmin = false,
  onUpdateAdmin,
}: ModifyBookingDialogProps) {
  const [date, setDate] = useState(booking.date);
  const [startTime, setStartTime] = useState(booking.startTime);
  const [endTime, setEndTime] = useState(booking.endTime);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [roomLoading, setRoomLoading] = useState(false);

  const roomName = booking.roomName || booking.room?.name || 'Salle inconnue';
  const bookingId = booking.id || booking.bookingId || '';
  const roomId = booking.roomId || booking.room?.id || '';

  useEffect(() => {
    if (open && roomId) {
      setDate(booking.date);
      setStartTime(booking.startTime);
      setEndTime(booking.endTime);
      setSuccess(false);
      setError(null);

      const loadRoomData = async () => {
        setRoomLoading(true);
        try {
          const response = await apiService.getRoomById(roomId);
          if (response.success && response.data) {
            setRoomData(response.data);
          }
        } catch (err) {
          console.error('Error loading room data:', err);
        } finally {
          setRoomLoading(false);
        }
      };

      loadRoomData();
    }
  }, [open, roomId, booking.date, booking.startTime, booking.endTime]);

  const handleSlotSelect = (
    selectedDate: string,
    selectedStartTime: string,
    selectedEndTime: string
  ) => {
    setDate(selectedDate);
    setStartTime(selectedStartTime);
    setEndTime(selectedEndTime);
    setError(null);
  };

  const calculateNewPrice = () => {
    if (!startTime || !endTime || !roomData) return booking.totalPrice;

    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const hours = endHour - startHour;

    return hours * roomData.pricePerHour;
  };

  const newPrice = calculateNewPrice();
  const priceIncrease = newPrice > booking.totalPrice;
  const priceChange = newPrice - booking.totalPrice;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!date || !startTime || !endTime) {
      setError('Veuillez sélectionner un créneau horaire');
      setLoading(false);
      return;
    }

    if (startTime >= endTime) {
      setError("L'heure de fin doit être après l'heure de début");
      setLoading(false);
      return;
    }

    if (priceIncrease) {
      setError(
        `Cette modification augmenterait le prix de ${priceChange.toFixed(2)}€ (de ${booking.totalPrice}€ à ${newPrice}€). Pour augmenter la durée de votre réservation, veuillez l'annuler et créer une nouvelle réservation.`
      );
      setLoading(false);
      return;
    }

    const hasChanges =
      date !== booking.date || startTime !== booking.startTime || endTime !== booking.endTime;

    if (!hasChanges) {
      setError('Aucune modification détectée');
      setLoading(false);
      return;
    }

    try {
      if (isAdmin && onUpdateAdmin) {
        await onUpdateAdmin(bookingId, {
          date,
          startTime,
          endTime,
        });
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(false);
          onSuccess?.();
        }, 2000);
      } else {
        const response = await apiService.updateBooking(bookingId, {
          date,
          startTime,
          endTime,
        });

        if (response.success) {
          setSuccess(true);
          setTimeout(() => {
            onOpenChange(false);
            setSuccess(false);
            onSuccess?.();
          }, 2000);
        } else {
          setError(response.error?.message || 'Erreur lors de la modification');
        }
      }
    } catch {
      setError('Erreur lors de la modification de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookedSlots =
    roomData?.bookedSlots?.filter(
      (slot) =>
        !(
          slot.date === booking.date &&
          slot.startTime === booking.startTime &&
          slot.endTime === booking.endTime
        )
    ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{success ? 'Réservation modifiée' : 'Modifier la réservation'}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-center">
                Votre réservation pour <strong>{roomName}</strong> a été modifiée avec succès.
                <br />
                Un email de confirmation vous a été envoyé.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4">
                Modifiez les détails de votre réservation pour <strong>{roomName}</strong>
              </p>

              {/* Avertissement remboursement */}
              <div className="flex items-start gap-2 text-sm p-3 mb-4 bg-amber-50 border border-amber-200 rounded-md">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0"
                />
                <p className="text-amber-800 leading-relaxed">
                  <strong>Attention :</strong> Une fois modifiée, cette réservation ne pourra plus
                  être remboursée. Si vous souhaitez un remboursement, veuillez annuler la
                  réservation avant de la modifier.
                </p>
              </div>

              {roomLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !roomData ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                  <p className="text-sm">
                    Impossible de charger les disponibilités de la salle. Veuillez réessayer.
                  </p>
                  <p className="text-xs mt-2">Room ID: {roomId}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <SlotPicker
                    bookedSlots={filteredBookedSlots}
                    onSlotSelect={handleSlotSelect}
                    initialDate={booking.date}
                    initialStartTime={booking.startTime}
                    initialEndTime={booking.endTime}
                  />

                  {date && startTime && endTime && (
                    <>
                      <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                        <p className="text-sm font-medium">
                          Nouveau créneau sélectionné :{' '}
                          <strong>
                            {new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </strong>{' '}
                          de <strong>{startTime}</strong> à <strong>{endTime}</strong>
                        </p>
                      </div>

                      {/* Affichage du prix */}
                      <div
                        className={`p-4 rounded-lg border ${
                          priceIncrease
                            ? 'bg-red-50 border-red-200'
                            : priceChange < 0
                              ? 'bg-green-50 border-green-200'
                              : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Prix actuel :</span>
                          <span className="text-sm">{booking.totalPrice}€</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Nouveau prix :</span>
                          <span
                            className={`text-sm font-bold ${
                              priceIncrease
                                ? 'text-red-600'
                                : priceChange < 0
                                  ? 'text-green-600'
                                  : ''
                            }`}
                          >
                            {newPrice}€
                          </span>
                        </div>
                        {priceChange !== 0 && (
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm font-medium">Différence :</span>
                            <span
                              className={`text-sm font-bold ${
                                priceIncrease ? 'text-red-600' : 'text-green-600'
                              }`}
                            >
                              {priceChange > 0 ? '+' : ''}
                              {priceChange.toFixed(2)}€
                            </span>
                          </div>
                        )}
                        {priceIncrease && (
                          <p className="text-xs text-red-600 mt-2">
                            Les modifications qui augmentent le prix ne sont pas autorisées
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {date && startTime && endTime && !priceIncrease && priceChange < 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note :</strong> La réduction de durée n'entraîne pas de
                        remboursement automatique. Le prix sera ajusté mais vous ne serez pas
                        remboursé de la différence.
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg flex items-start gap-2">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="h-5 w-5 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {!success && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={loading || roomLoading || !date}>
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  Modification...
                </>
              ) : (
                'Confirmer la modification'
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
