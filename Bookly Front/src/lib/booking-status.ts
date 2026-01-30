/**
 * Utilitaires pour la gestion des statuts de réservation
 */

import type { Booking } from '@/types';

export type BookingStatusBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/**
 * Obtenir le label français d'un statut de réservation
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    // Statuts de paiement
    pending_payment: 'En attente de paiement',
    payment_processing: 'Paiement en cours',
    payment_received: 'Paiement reçu',

    // Statuts actifs
    confirmed: 'Confirmée',
    checked_in: 'Arrivé',
    in_progress: 'En cours',
    completed: 'Terminée',
    modified: 'Modifiée',

    // Statuts d'annulation
    cancelled_by_user: 'Annulée par le client',
    cancelled_by_admin: 'Annulée par admin',
    cancelled_no_payment: 'Annulée (impayée)',
    cancelled: 'Annulée',

    // Autres
    no_show: 'Absent',
    refunded: 'Remboursée',
  };

  return labels[status.toLowerCase()] || status;
}

/**
 * Obtenir la variante de badge pour un statut
 */
export function getStatusVariant(status: string): BookingStatusBadgeVariant {
  const statusLower = status.toLowerCase();

  if (['confirmed', 'checked_in', 'completed'].includes(statusLower)) {
    return 'default';
  }

  if (
    [
      'pending_payment',
      'payment_processing',
      'in_progress',
      'modified',
      'payment_received',
    ].includes(statusLower)
  ) {
    return 'secondary';
  }

  if (
    [
      'cancelled',
      'cancelled_by_user',
      'cancelled_by_admin',
      'cancelled_no_payment',
      'refunded',
      'no_show',
    ].includes(statusLower)
  ) {
    return 'destructive';
  }

  return 'outline';
}

/**
 * Vérifier si une réservation peut être annulée
 */
export function canCancelBooking(booking: Booking): boolean {
  const statusUpper = booking.status.toUpperCase();

  const nonCancellableStatuses = [
    'CANCELLED',
    'CANCELLED_BY_USER',
    'CANCELLED_BY_ADMIN',
    'CANCELLED_NO_PAYMENT',
    'COMPLETED',
    'REFUNDED',
  ];

  return !nonCancellableStatuses.includes(statusUpper);
}

/**
 * Vérifier si une réservation peut être modifiée
 */
export function canModifyBooking(booking: Booking): boolean {
  const statusLower = booking.status.toLowerCase();

  const modifiableStatuses = ['confirmed', 'pending_payment', 'payment_received'];

  return modifiableStatuses.includes(statusLower);
}

/**
 * Vérifier si une réservation est active (bloque un créneau)
 */
export function isBookingActive(booking: Booking): boolean {
  const statusLower = booking.status.toLowerCase();

  const activeStatuses = [
    'pending_payment',
    'payment_received',
    'confirmed',
    'checked_in',
    'in_progress',
    'modified',
  ];

  return activeStatuses.includes(statusLower);
}
