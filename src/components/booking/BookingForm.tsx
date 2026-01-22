import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faUsers,
  faCalendarCheck,
  faEuroSign,
} from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SlotPicker } from './SlotPicker';
import { useBooking } from '../../hooks/useBooking';
import type { Room, BookingFormData } from '../../types';

interface BookingFormProps {
  room: Room;
  selectedDate?: string;
  selectedSlot?: { start: string; end: string };
  onSuccess: () => void;
}

export function BookingForm({ room, selectedDate, selectedSlot, onSuccess }: BookingFormProps) {
  const { loading, error, createBooking } = useBooking();

  const [formData, setFormData] = useState({
    date: selectedDate || '',
    startTime: selectedSlot?.start || '',
    endTime: selectedSlot?.end || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfPeople: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName || formData.customerName.length < 2) {
      newErrors.customerName = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.customerEmail || !formData.customerEmail.includes('@')) {
      newErrors.customerEmail = 'Email invalide';
    }

    if (!formData.customerPhone || formData.customerPhone.length < 10) {
      newErrors.customerPhone = 'Numéro de téléphone invalide';
    }

    const numPeople = parseInt(formData.numberOfPeople);
    if (!formData.numberOfPeople || numPeople < 1) {
      newErrors.numberOfPeople = 'Nombre de personnes requis';
    } else if (numPeople > room.capacity) {
      newErrors.numberOfPeople = `Le nombre de personnes dépasse la capacité (max: ${room.capacity})`;
    }

    if (!formData.date) {
      newErrors.date = 'Date requise';
    }

    if (!formData.startTime || !formData.endTime) {
      newErrors.time = 'Horaires requis';
    } else if (formData.startTime >= formData.endTime) {
      newErrors.time = "L'heure de fin doit être après l'heure de début";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const bookingData: BookingFormData = {
      roomId: room.id,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      numberOfPeople: parseInt(formData.numberOfPeople),
    };

    const result = await createBooking(bookingData);
    if (result.success) {
      onSuccess();
    }
  };

  const isFormValid = () => {
    return (
      formData.customerName.length >= 2 &&
      formData.customerEmail.includes('@') &&
      formData.customerPhone.length >= 10 &&
      formData.numberOfPeople &&
      parseInt(formData.numberOfPeople) > 0 &&
      parseInt(formData.numberOfPeople) <= room.capacity &&
      formData.date &&
      formData.startTime &&
      formData.endTime &&
      formData.startTime < formData.endTime
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5 text-primary" />
          Réserver cette salle
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <SlotPicker
          bookedSlots={room.bookedSlots}
          onSlotSelect={(date, startTime, endTime) => {
            setFormData({ ...formData, date, startTime, endTime });
            setErrors({ ...errors, date: '', time: '' });
          }}
        />

        {formData.date && formData.startTime && formData.endTime && (
          <div className="flex items-start gap-3 p-4 bg-primary/5 border-l-4 border-primary rounded-lg">
            <FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">Créneau sélectionné</p>
              <p className="text-sm text-muted-foreground">
                {new Date(formData.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                de {formData.startTime} à {formData.endTime}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-muted-foreground" />
              Nom complet
            </label>
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Jean Dupont"
              required
              disabled={loading}
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-muted-foreground" />
              Email
            </label>
            <Input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, customerEmail: value });
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                  setErrors({ ...errors, customerEmail: 'Format email invalide' });
                } else if (errors.customerEmail) {
                  const newErrors = { ...errors };
                  delete newErrors.customerEmail;
                  setErrors(newErrors);
                }
              }}
              placeholder="jean.dupont@example.com"
              required
              disabled={loading}
            />
            {errors.customerEmail && (
              <p className="text-sm text-destructive">{errors.customerEmail}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-muted-foreground" />
              Téléphone
            </label>
            <Input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="+33612345678"
              required
              disabled={loading}
            />
            {errors.customerPhone && (
              <p className="text-sm text-destructive">{errors.customerPhone}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-muted-foreground" />
              Nombre de personnes
            </label>
            <Input
              type="number"
              value={formData.numberOfPeople}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, numberOfPeople: value });
                const numPeople = parseInt(value);
                if (value && numPeople > room.capacity) {
                  setErrors({
                    ...errors,
                    numberOfPeople: `La capacité maximale est de ${room.capacity} personnes`,
                  });
                } else if (value && numPeople < 1) {
                  setErrors({ ...errors, numberOfPeople: 'Au moins 1 personne requise' });
                } else {
                  const newErrors = { ...errors };
                  delete newErrors.numberOfPeople;
                  setErrors(newErrors);
                }
              }}
              min={1}
              max={room.capacity}
              required
              disabled={loading}
            />
            {errors.numberOfPeople && (
              <p className="text-sm text-destructive">{errors.numberOfPeople}</p>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4" />
              Prix total:
            </span>
            <Badge variant="default" className="text-base px-3 py-1">
              {formData.startTime && formData.endTime
                ? `${calculatePrice(formData.startTime, formData.endTime, room.pricePerHour)}€`
                : '-'}
            </Badge>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive font-medium mb-2">{error.message}</p>
              {error.details && (
                <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
                  {Object.entries(error.details).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!isFormValid() || loading}>
            {loading ? 'Réservation en cours...' : 'Réserver'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function calculatePrice(startTime: string, endTime: string, pricePerHour: number): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const hours = endHour - startHour + (endMinute - startMinute) / 60;
  // Retourne 0 si durée négative ou invalide
  return hours > 0 ? Math.round(hours * pricePerHour) : 0;
}
