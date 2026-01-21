import { useState, useMemo } from 'react';
import type { BookedSlot, DayAvailability, TimeSlot } from '../../types';
import './SlotPicker.css';

interface SlotPickerProps {
  bookedSlots?: BookedSlot[];
  onSlotSelect: (date: string, startTime: string, endTime: string) => void;
}

export function SlotPicker({ bookedSlots = [], onSlotSelect }: SlotPickerProps) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);

  const availability = useMemo(() => {
    const allHours = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const result: DayAvailability[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = dayNames[date.getDay()];

      const bookedForDate = bookedSlots.filter((b) => b.date === dateStr);
      const bookedHours = new Set<string>();

      bookedForDate.forEach((booking) => {
        const start = parseInt(booking.startTime.split(':')[0]);
        const end = parseInt(booking.endTime.split(':')[0]);
        for (let h = start; h < end; h++) {
          bookedHours.add(`${h.toString().padStart(2, '0')}:00`);
        }
      });

      const timeSlots: TimeSlot[] = allHours.map((time) => ({
        time,
        available: !bookedHours.has(time),
        booked: bookedHours.has(time),
      }));

      result.push({
        date: dateStr,
        dayOfWeek,
        timeSlots,
      });
    }

    return result;
  }, [bookedSlots]);

  const [selectedDay, setSelectedDay] = useState<string>(
    availability[0]?.date || new Date().toISOString().split('T')[0]
  );

  if (!availability || availability.length === 0) {
    return (
      <div className="slot-picker-v2">
        <div className="slot-picker-v2__empty">
          <p>Aucune disponibilité pour les 7 prochains jours</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleDayClick = (date: string) => {
    setSelectedDay(date);
    setSelectedSlots([]);
  };

  const handleSlotMouseDown = (day: DayAvailability, slot: string, available: boolean) => {
    if (!available) return;

    setSelectedDay(day.date);
    setIsDragging(true);
    setDragStartSlot(slot);
    setSelectedSlots([slot]);
  };

  const handleSlotMouseEnter = (day: DayAvailability, slot: string, available: boolean) => {
    if (!isDragging || !available || day.date !== selectedDay) return;

    const daySlots = day.timeSlots.filter((s) => s.available).map((s) => s.time);
    const startIdx = daySlots.indexOf(dragStartSlot!);
    const currentIdx = daySlots.indexOf(slot);

    if (startIdx === -1 || currentIdx === -1) return;

    const minIdx = Math.min(startIdx, currentIdx);
    const maxIdx = Math.max(startIdx, currentIdx);
    const range = daySlots.slice(minIdx, maxIdx + 1);

    const allAvailable = range.every((time) => {
      const slotData = day.timeSlots.find((s) => s.time === time);
      return slotData?.available;
    });

    if (allAvailable) {
      setSelectedSlots(range);
    }
  };

  const handleSlotMouseUp = () => {
    if (!isDragging || selectedSlots.length === 0 || !selectedDay) {
      setIsDragging(false);
      return;
    }

    setIsDragging(false);

    const sortedSlots = [...selectedSlots].sort();
    const startTime = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];

    const [hour, minute] = lastSlot.split(':').map(Number);
    const endHour = hour + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    onSlotSelect(selectedDay, startTime, endTime);
  };

  const activeDay = availability.find((d) => d.date === selectedDay) || availability[0];

  return (
    <div
      className="slot-picker-v2"
      onMouseUp={handleSlotMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="slot-picker-v2__header">
        <h3 className="slot-picker-v2__title">📅 Sélectionnez votre créneau</h3>
        <div className="slot-picker-v2__help">
          <span className="slot-picker-v2__help-icon">💡</span>
          <span className="slot-picker-v2__help-text">
            Cliquez et glissez sur les créneaux disponibles pour réserver
          </span>
        </div>
      </div>

      {/* Calendrier des 7 jours */}
      <div className="slot-picker-v2__days">
        {availability.map((day) => {
          const availableCount = day.timeSlots.filter((s) => s.available).length;
          const isSelected = day.date === selectedDay;

          return (
            <button
              key={day.date}
              onClick={() => handleDayClick(day.date)}
              className={`slot-picker-v2__day ${isSelected ? 'slot-picker-v2__day--selected' : ''}`}
              disabled={availableCount === 0}
            >
              <span className="slot-picker-v2__day-name">{day.dayOfWeek}</span>
              <span className="slot-picker-v2__day-date">{formatDate(day.date)}</span>
              <span className="slot-picker-v2__day-count">
                {availableCount > 0 ? `${availableCount} créneaux` : 'Complet'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grille horaire */}
      <div className="slot-picker-v2__grid">
        <div className="slot-picker-v2__grid-header">
          <h4 className="slot-picker-v2__grid-title">
            {activeDay.dayOfWeek} {formatDate(activeDay.date)}
          </h4>
          {selectedSlots.length > 0 && (
            <div className="slot-picker-v2__selection-info">
              <span className="slot-picker-v2__selection-icon">✓</span>
              <span className="slot-picker-v2__selection-text">
                {selectedSlots.length}h • {selectedSlots[0]} -{' '}
                {(() => {
                  const lastSlot = selectedSlots[selectedSlots.length - 1];
                  const [h, m] = lastSlot.split(':').map(Number);
                  return `${(h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                })()}
              </span>
            </div>
          )}
        </div>

        <div className="slot-picker-v2__slots">
          {activeDay.timeSlots.map((slot) => {
            const isSelected = selectedDay === activeDay.date && selectedSlots.includes(slot.time);

            return (
              <button
                key={slot.time}
                className={`slot-picker-v2__slot 
                  ${!slot.available ? 'slot-picker-v2__slot--booked' : ''} 
                  ${isSelected ? 'slot-picker-v2__slot--selected' : ''}
                  ${slot.available ? 'slot-picker-v2__slot--available' : ''}`}
                disabled={!slot.available}
                onMouseDown={() => handleSlotMouseDown(activeDay, slot.time, slot.available)}
                onMouseEnter={() => handleSlotMouseEnter(activeDay, slot.time, slot.available)}
              >
                <span className="slot-picker-v2__slot-time">{slot.time}</span>
                <span className="slot-picker-v2__slot-status">{slot.available ? '✓' : '✕'}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
