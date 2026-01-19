// Validateurs pour les formulaires

export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    // Accepte différents formats de téléphone
    const phoneRegex = /^[\d\s+()-]{10,}$/;
    return phoneRegex.test(phone);
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  isPositiveNumber: (value: number): boolean => {
    return value > 0;
  },

  isDateInFuture: (date: string): boolean => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  },

  isTimeValid: (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return false;
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    return endMinutes > startMinutes;
  },
};

export const getValidationError = {
  email: (email: string): string | undefined => {
    if (!email) return 'Email requis';
    if (!validators.email(email)) return "Format d'email invalide";
    return undefined;
  },

  phone: (phone: string): string | undefined => {
    if (!phone) return 'Téléphone requis';
    if (!validators.phone(phone)) return 'Numéro de téléphone invalide';
    return undefined;
  },

  name: (name: string, min = 2): string | undefined => {
    if (!name) return 'Nom requis';
    if (!validators.minLength(name, min)) return `Le nom doit contenir au moins ${min} caractères`;
    return undefined;
  },

  numberOfPeople: (num: number, maxCapacity: number): string | undefined => {
    if (!num) return 'Nombre de personnes requis';
    if (!validators.isPositiveNumber(num)) return 'Doit être un nombre positif';
    if (num > maxCapacity)
      return `Le nombre de personnes dépasse la capacité (max: ${maxCapacity})`;
    return undefined;
  },

  date: (date: string): string | undefined => {
    if (!date) return 'Date requise';
    if (!validators.isDateInFuture(date)) return 'La date ne peut pas être dans le passé';
    return undefined;
  },

  time: (startTime: string, endTime: string): string | undefined => {
    if (!startTime || !endTime) return 'Horaires requis';
    if (!validators.isTimeValid(startTime, endTime))
      return "L'heure de fin doit être après l'heure de début";
    return undefined;
  },
};
