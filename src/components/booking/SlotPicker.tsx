import { useState } from 'react';
import type { AvailableSlot } from '../../types';
import './SlotPicker.css';

interface SlotPickerProps {
  availableSlots?: AvailableSlot[];
  selectedDate: string;
  selectedStartTime: string;
  onSlotSelect: (date: string, startTime: string, endTime: string) => void;
}

export function SlotPicker({
  availableSlots = [],
  selectedDate,
  selectedStartTime,
  onSlotSelect,
}: SlotPickerProps) {
  const [activeDate, setActiveDate] = useState(selectedDate || availableSlots[0]?.date || '');

  const handleSlotClick = (slot: string) => {
    // Calculer l'heure de fin (1 heure par défaut, max 23:00)
    const [hour, minute] = slot.split(':').map(Number);
    const endHour = Math.min(hour + 1, 23); // Évite le dépassement à 24h
    const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    onSlotSelect(activeDate, slot, endTime);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const isSlotSelected = (slot: string) => {
    return activeDate === selectedDate && slot === selectedStartTime;
  };

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="slot-picker">
        <p className="slot-picker__no-slots">Aucun créneau disponible</p>
      </div>
    );
  }

  const activeDateSlots = availableSlots.find((s) => s.date === activeDate);

  return (
    <div className="slot-picker">
      <div className="slot-picker__dates">
        {availableSlots.map((slotDate) => (
          <button
            key={slotDate.date}
            onClick={() => setActiveDate(slotDate.date)}
            className={`slot-picker__date ${activeDate === slotDate.date ? 'slot-picker__date--active' : ''}`}
          >
            {formatDate(slotDate.date)}
          </button>
        ))}
      </div>

      <div className="slot-picker__slots">
        <h4 className="slot-picker__slots-title">Créneaux disponibles</h4>
        <div className="slot-picker__slots-grid">
          {activeDateSlots?.slots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleSlotClick(slot)}
              className={`slot-picker__slot ${isSlotSelected(slot) ? 'slot-picker__slot--selected' : ''}`}
            >
              {slot}
            </button>
          ))}
          {(!activeDateSlots || activeDateSlots.slots.length === 0) && (
            <p className="slot-picker__no-slots-for-date">
              Aucun créneau disponible pour cette date
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
