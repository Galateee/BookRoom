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
      formData.endTime
    );
  };

  return (
    <div className="booking-form">
      <h2 className="booking-form__title">Réserver cette salle</h2>

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

      <SlotPicker
        availableSlots={room.availableSlots}
        selectedDate={formData.date}
        selectedStartTime={formData.startTime}
        selectedEndTime={formData.endTime}
        onSlotSelect={(date, startTime, endTime) => {
          setFormData({ ...formData, date, startTime, endTime });
          setErrors({ ...errors, date: '', time: '' });
        }}
      />

      <form onSubmit={handleSubmit}>
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(value) => setFormData({ ...formData, date: value })}
          error={errors.date}
          required
          disabled={loading}
          min={new Date().toISOString().split('T')[0]}
        />

        <div className="booking-form__time-row">
          <Input
            label="Heure de début"
            type="time"
            value={formData.startTime}
            onChange={(value) => setFormData({ ...formData, startTime: value })}
            error={errors.time}
            required
            disabled={loading}
          />
          <Input
            label="Heure de fin"
            type="time"
            value={formData.endTime}
            onChange={(value) => setFormData({ ...formData, endTime: value })}
            error={errors.time}
            required
            disabled={loading}
          />
        </div>

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
          onChange={(value) => setFormData({ ...formData, customerEmail: value })}
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
          onChange={(value) => setFormData({ ...formData, numberOfPeople: value })}
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
  return Math.round(hours * pricePerHour);
}
