import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faLightbulb, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { BookedSlot, DayAvailability, TimeSlot } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SlotPickerProps {
  bookedSlots?: BookedSlot[];
  onSlotSelect: (date: string, startTime: string, endTime: string) => void;
  initialDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
}

export function SlotPicker({
  bookedSlots = [],
  onSlotSelect,
  initialDate,
  initialStartTime,
  initialEndTime,
}: SlotPickerProps) {
  const getInitialSlots = () => {
    if (!initialStartTime || !initialEndTime) return [];

    const startHour = parseInt(initialStartTime.split(':')[0]);
    const endHour = parseInt(initialEndTime.split(':')[0]);
    const slots: string[] = [];

    for (let h = startHour; h < endHour; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
    }

    return slots;
  };

  const [selectedSlots, setSelectedSlots] = useState<string[]>(getInitialSlots());
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
    initialDate || availability[0]?.date || new Date().toISOString().split('T')[0]
  );

  if (!availability || availability.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Aucune disponibilité pour les 7 prochains jours
          </p>
        </CardContent>
      </Card>
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
    <Card
      className="select-none"
      onMouseUp={handleSlotMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarDay} className="h-5 w-5 text-primary" />
          Sélectionnez votre créneau
        </CardTitle>
        <div className="flex items-start gap-3 mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
          <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-900 font-medium leading-relaxed">
            Cliquez et glissez sur les créneaux disponibles pour réserver
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Calendrier des 7 jours */}
        <div className="grid grid-cols-7 gap-2">
          {availability.map((day) => {
            const availableCount = day.timeSlots.filter((s) => s.available).length;
            const isSelected = day.date === selectedDay;

            return (
              <button
                key={day.date}
                onClick={() => handleDayClick(day.date)}
                disabled={availableCount === 0}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
                  'hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed',
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-muted/50 border-transparent'
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {day.dayOfWeek}
                </span>
                <span className="text-base font-medium">{formatDate(day.date)}</span>
                <span className="text-xs text-muted-foreground">
                  {availableCount > 0 ? `${availableCount} créneaux` : 'Complet'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grille horaire */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              {activeDay.dayOfWeek} {formatDate(activeDay.date)}
            </h4>
            {selectedSlots.length > 0 && (
              <Badge variant="default" className="gap-2 px-3 py-1.5">
                <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                <span>
                  {selectedSlots.length}h • {selectedSlots[0]} -{' '}
                  {(() => {
                    const lastSlot = selectedSlots[selectedSlots.length - 1];
                    const [h, m] = lastSlot.split(':').map(Number);
                    return `${(h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                  })()}
                </span>
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-11 gap-2">
            {activeDay.timeSlots.map((slot) => {
              const isSelected =
                selectedDay === activeDay.date && selectedSlots.includes(slot.time);

              return (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onMouseDown={() => handleSlotMouseDown(activeDay, slot.time, slot.available)}
                  onMouseEnter={() => handleSlotMouseEnter(activeDay, slot.time, slot.available)}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
                    'disabled:cursor-not-allowed',
                    !slot.available &&
                      'bg-destructive/10 border-destructive/30 text-destructive opacity-50',
                    slot.available &&
                      !isSelected &&
                      'bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300 hover:scale-105 hover:shadow-md',
                    isSelected &&
                      'bg-primary border-primary text-primary-foreground scale-105 shadow-lg'
                  )}
                >
                  <span className="text-base font-semibold">{slot.time}</span>
                  <FontAwesomeIcon
                    icon={slot.available ? faCheck : faTimes}
                    className="h-3 w-3 mt-1 opacity-70"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
