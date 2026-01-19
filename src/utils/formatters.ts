// Formatters pour l'affichage des données

export const formatters = {
  // Formater une date en français
  date: (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('fr-FR', options || defaultOptions);
  },

  // Formater une date courte
  dateShort: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  },

  // Formater un prix
  price: (amount: number): string => {
    return `${amount}€`;
  },

  // Formater un prix par heure
  pricePerHour: (amount: number): string => {
    return `${amount}€/h`;
  },

  // Formater une heure
  time: (timeString: string): string => {
    return timeString;
  },

  // Formater une plage horaire
  timeRange: (startTime: string, endTime: string): string => {
    return `${startTime} - ${endTime}`;
  },

  // Calculer la durée en heures
  duration: (startTime: string, endTime: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    return endHour - startHour + (endMinute - startMinute) / 60;
  },

  // Calculer le prix total
  calculateTotalPrice: (startTime: string, endTime: string, pricePerHour: number): number => {
    const hours = formatters.duration(startTime, endTime);
    return Math.round(hours * pricePerHour);
  },

  // Formater le statut de réservation
  bookingStatus: (status: string): string => {
    const statusMap: Record<string, string> = {
      confirmed: 'Confirmée',
      cancelled: 'Annulée',
      completed: 'Terminée',
    };
    return statusMap[status] || status;
  },

  // Formater un nom d'équipement
  equipment: (equipment: string): string => {
    const equipmentMap: Record<string, string> = {
      projector: 'Projecteur',
      whiteboard: 'Tableau blanc',
      wifi: 'Wi-Fi',
      'video-conference': 'Visioconférence',
      'sound-system': 'Système audio',
      'coffee-machine': 'Machine à café',
      'creative-tools': 'Outils créatifs',
    };
    return equipmentMap[equipment] || equipment;
  },

  // Pluraliser "personne(s)"
  people: (count: number): string => {
    return count > 1 ? `${count} personnes` : `${count} personne`;
  },

  // Pluraliser "salle(s)"
  rooms: (count: number): string => {
    return count > 1 ? `${count} salles` : `${count} salle`;
  },

  // Pluraliser "réservation(s)"
  bookings: (count: number): string => {
    return count > 1 ? `${count} réservations` : `${count} réservation`;
  },
};
