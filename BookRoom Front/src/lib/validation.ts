/**
 * Utilitaires de validation pour les formulaires
 */

/**
 * Valider un format d'email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un numéro de téléphone (format français)
 */
export function isValidPhone(phone: string): boolean {
  // Accepte les formats: 0612345678, +33612345678, 06 12 34 56 78
  const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
  const cleaned = phone.replace(/\s/g, '');
  return phoneRegex.test(cleaned);
}

/**
 * Valider une capacité de salle
 */
export function isValidCapacity(numberOfPeople: number, maxCapacity: number): boolean {
  return numberOfPeople >= 1 && numberOfPeople <= maxCapacity;
}

/**
 * Valider un créneau horaire
 */
export function isValidTimeSlot(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false;
  return startTime < endTime;
}

/**
 * Calculer le prix d'une réservation en fonction du créneau horaire
 */
export function calculateBookingPrice(
  startTime: string,
  endTime: string,
  pricePerHour: number
): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const durationMinutes = endTotalMinutes - startTotalMinutes;

  if (durationMinutes <= 0) return 0;

  const hours = durationMinutes / 60;
  return Math.round(hours * pricePerHour * 100) / 100;
}

/**
 * Formater une date au format français
 */
export function formatFrenchDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formater une date courte au format français
 */
export function formatShortFrenchDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}
