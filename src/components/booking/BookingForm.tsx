import { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SlotPicker } from './SlotPicker';
import { useBooking } from '../../hooks/useBooking';
import type { Room, BookingFormData } from '../../types';
import './BookingForm.css';

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
    <div className="booking-form">
      <h2 className="booking-form__title">Réserver cette salle</h2>

      <SlotPicker
        bookedSlots={room.bookedSlots}
        onSlotSelect={(date, startTime, endTime) => {
          setFormData({ ...formData, date, startTime, endTime });
          setErrors({ ...errors, date: '', time: '' });
        }}
      />

      {formData.date && formData.startTime && formData.endTime && (
        <div className="booking-form__selected-slot">
          <div className="booking-form__selected-slot-icon">📅</div>
          <div className="booking-form__selected-slot-details">
            <p className="booking-form__selected-slot-title">Créneau sélectionné</p>
            <p className="booking-form__selected-slot-info">
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

      <form onSubmit={handleSubmit}>
        <Input
          label="Nom complet"
          value={formData.customerName}
          onChange={(value) => setFormData({ ...formData, customerName: value })}
          error={errors.customerName}
          placeholder="Jean Dupont"
          required
          disabled={loading}
        />

        <Input
          label="Email"
          type="email"
          value={formData.customerEmail}
          onChange={(value) => {
            setFormData({ ...formData, customerEmail: value });
            // Valider le format email en temps réel
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
              setErrors({ ...errors, customerEmail: 'Format email invalide' });
            } else if (errors.customerEmail) {
              const newErrors = { ...errors };
              delete newErrors.customerEmail;
              setErrors(newErrors);
            }
          }}
          error={errors.customerEmail}
          placeholder="jean.dupont@example.com"
          required
          disabled={loading}
        />

        <Input
          label="Téléphone"
          type="tel"
          value={formData.customerPhone}
          onChange={(value) => setFormData({ ...formData, customerPhone: value })}
          error={errors.customerPhone}
          placeholder="+33612345678"
          required
          disabled={loading}
        />

        <Input
          label="Nombre de personnes"
          type="number"
          value={formData.numberOfPeople}
          onChange={(value) => {
            setFormData({ ...formData, numberOfPeople: value });
            // Validation en temps réel
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
          error={errors.numberOfPeople}
          min={1}
          max={room.capacity}
          required
          disabled={loading}
        />

        <div className="booking-form__summary">
          <span>Prix total estimé:</span>
          <span className="booking-form__price">
            {formData.startTime && formData.endTime
              ? `${calculatePrice(formData.startTime, formData.endTime, room.pricePerHour)}€`
              : '-'}
          </span>
        </div>

        {error && (
          <div className="booking-form__error">
            <p className="booking-form__error-message">{error.message}</p>
            {error.details && (
              <ul className="booking-form__error-details">
                {Object.entries(error.details).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Button type="submit" fullWidth disabled={!isFormValid() || loading} loading={loading}>
          {loading ? 'Réservation en cours...' : 'Réserver'}
        </Button>
      </form>
    </div>
  );
}

function calculatePrice(startTime: string, endTime: string, pricePerHour: number): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const hours = endHour - startHour + (endMinute - startMinute) / 60;
  // Retourne 0 si durée négative ou invalide
  return hours > 0 ? Math.round(hours * pricePerHour) : 0;
}
