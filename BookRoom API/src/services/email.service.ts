import nodemailer from "nodemailer";
import type { Booking, Room } from "@prisma/client";

const FROM_EMAIL = process.env.EMAIL_FROM || "BookRoom <noreply@bookroom.local>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bookroom.local";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Créer le transporteur Nodemailer avec Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Types pour les bookings avec relations
type BookingWithRoom = Booking & { room: Room };

/**
 * Service d'envoi d'emails avec gestion d'erreurs
 * Les erreurs ne bloquent jamais le flux métier
 */
class EmailService {
  /**
   * Envoi générique avec gestion d'erreurs
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    retries = 2
  ): Promise<boolean> {
    // En environnement de test, on simule l'envoi
    if (process.env.NODE_ENV === "test") {
      console.log(`[TEST] Email envoyé à ${to}: ${subject}`);
      return true;
    }

    // Si pas de configuration Gmail, on log et on continue
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn(`Email non envoyé (Gmail non configuré): ${subject} → ${to}`);
      return false;
    }

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        await transporter.sendMail({
          from: FROM_EMAIL,
          to,
          subject,
          html,
        });

        console.log(`Email envoyé: ${subject} → ${to}`);
        return true;
      } catch (error) {
        console.error(
          `Erreur envoi email (tentative ${attempt}/${retries + 1}):`,
          error instanceof Error ? error.message : error
        );

        if (attempt <= retries) {
          // Attendre avant de réessayer (backoff exponentiel)
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    return false;
  }

  /**
   * Formater une date en français
   */
  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  /**
   * Email de confirmation de réservation
   */
  async sendBookingConfirmation(booking: BookingWithRoom): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de réservation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Réservation confirmée</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333;">
                Bonjour <strong>${booking.customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; color: #666;">
                Votre réservation a été confirmée avec succès. Voici les détails :
              </p>
              
              <!-- Booking Details -->
              <table width="100%" cellpadding="12" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="font-weight: bold; color: #667eea; padding: 12px;">Salle :</td>
                  <td style="color: #333; padding: 12px;">${booking.room.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #667eea; padding: 12px;">Date :</td>
                  <td style="color: #333; padding: 12px;">${this.formatDate(booking.date)}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #667eea; padding: 12px;">Horaire :</td>
                  <td style="color: #333; padding: 12px;">${booking.startTime} - ${booking.endTime}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #667eea; padding: 12px;">Participants :</td>
                  <td style="color: #333; padding: 12px;">${booking.numberOfPeople} personne(s)</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #667eea; padding: 12px;">Prix total :</td>
                  <td style="color: #333; padding: 12px; font-size: 18px; font-weight: bold;">${booking.totalPrice.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #667eea; padding: 12px;">N° Réservation :</td>
                  <td style="color: #666; padding: 12px; font-family: monospace; font-size: 12px;">${booking.id}</td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${FRONTEND_URL}/my-bookings" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Voir mes réservations
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px; font-size: 14px; color: #666;">
                <strong>Conseils :</strong>
              </p>
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #666; font-size: 14px;">
                <li>Arrivez 5 minutes avant le début de votre créneau</li>
                <li>Pensez à annuler si vous ne pouvez pas venir</li>
              </ul>
              
              <p style="margin: 0; font-size: 14px; color: #999;">
                À bientôt sur BookRoom !
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 5px; font-size: 12px; color: #999;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} BookRoom - Tous droits réservés
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail(
      booking.customerEmail,
      `Réservation confirmée - ${booking.room.name}`,
      html
    );
  }

  /**
   * Email de modification de réservation
   */
  async sendBookingModification(booking: BookingWithRoom): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Modification de réservation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Réservation modifiée</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333;">
                Bonjour <strong>${booking.customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; color: #666;">
                Votre réservation a été modifiée. Voici les nouvelles informations :
              </p>
              
              <table width="100%" cellpadding="12" style="background-color: #fff5f5; border-radius: 6px; border-left: 4px solid #f5576c; margin-bottom: 30px;">
                <tr>
                  <td style="font-weight: bold; color: #f5576c; padding: 12px;">Salle :</td>
                  <td style="color: #333; padding: 12px;">${booking.room.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #f5576c; padding: 12px;">Date :</td>
                  <td style="color: #333; padding: 12px;">${this.formatDate(booking.date)}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #f5576c; padding: 12px;">Horaire :</td>
                  <td style="color: #333; padding: 12px;">${booking.startTime} - ${booking.endTime}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #f5576c; padding: 12px;">Prix :</td>
                  <td style="color: #333; padding: 12px; font-weight: bold;">${booking.totalPrice.toFixed(2)} €</td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="${FRONTEND_URL}/my-bookings" style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                      Voir ma réservation
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} BookRoom
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail(
      booking.customerEmail,
      `Réservation modifiée - ${booking.room.name}`,
      html
    );
  }

  /**
   * Email d'annulation de réservation
   */
  async sendBookingCancellation(booking: BookingWithRoom): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Annulation de réservation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #868f96 0%, #596164 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Réservation annulée</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333;">
                Bonjour <strong>${booking.customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; color: #666;">
                Votre réservation a été annulée comme demandé.
              </p>
              
              <table width="100%" cellpadding="12" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="font-weight: bold; color: #596164; padding: 12px;">Salle :</td>
                  <td style="color: #333; padding: 12px;">${booking.room.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #596164; padding: 12px;">Date :</td>
                  <td style="color: #333; padding: 12px;">${this.formatDate(booking.date)}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #596164; padding: 12px;">Horaire :</td>
                  <td style="color: #333; padding: 12px;">${booking.startTime} - ${booking.endTime}</td>
                </tr>
              </table>
              
              ${
                booking.status === "REFUNDED"
                  ? `
              <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0; color: #155724; font-weight: bold;">
                  Remboursement en cours
                </p>
                <p style="margin: 5px 0 0; color: #155724; font-size: 14px;">
                  Le montant de ${booking.totalPrice.toFixed(2)} € sera crédité sur votre compte sous 5-10 jours ouvrés.
                </p>
              </div>
              `
                  : ""
              }
              
              <p style="margin: 0 0 20px; font-size: 14px; color: #666;">
                Nous espérons vous revoir bientôt sur BookRoom.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${FRONTEND_URL}/rooms" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                      Voir les salles disponibles
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} BookRoom
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail(booking.customerEmail, `Réservation annulée - ${booking.room.name}`, html);
  }

  /**
   * Email de rappel avant la réservation (J-1)
   */
  async sendBookingReminder(booking: BookingWithRoom): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rappel de réservation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #2d3436; font-size: 28px;">Rappel de réservation</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333;">
                Bonjour <strong>${booking.customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; color: #666;">
                Petit rappel : votre réservation est prévue <strong>demain</strong> !
              </p>
              
              <table width="100%" cellpadding="12" style="background-color: #fffbea; border-radius: 6px; border-left: 4px solid #fdcb6e; margin-bottom: 30px;">
                <tr>
                  <td style="font-weight: bold; color: #d63031; padding: 12px;">Salle :</td>
                  <td style="color: #333; padding: 12px;">${booking.room.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #d63031; padding: 12px;">Date :</td>
                  <td style="color: #333; padding: 12px;">${this.formatDate(booking.date)}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #d63031; padding: 12px;">Horaire :</td>
                  <td style="color: #333; padding: 12px; font-size: 18px; font-weight: bold;">${booking.startTime} - ${booking.endTime}</td>
                </tr>
              </table>
              
              <div style="background-color: #e8f5e9; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px; color: #2e7d32; font-weight: bold;">Conseils pour votre réunion :</p>
                <ul style="margin: 0; padding-left: 20px; color: #2e7d32;">
                  <li>Arrivez 5 minutes en avance</li>
                  <li>Pensez à apporter votre matériel si nécessaire</li>
                  <li>La salle dispose de : ${booking.room.equipments.join(", ")}</li>
                </ul>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="${FRONTEND_URL}/my-bookings" style="display: inline-block; background: linear-gradient(135deg, #fdcb6e 0%, #fab1a0 100%); color: #2d3436; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                      Voir ma réservation
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 14px; color: #999; text-align: center;">
                Si vous ne pouvez pas venir, pensez à annuler votre réservation.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} BookRoom
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail(
      booking.customerEmail,
      `Rappel : Votre réservation demain à ${booking.startTime}`,
      html
    );
  }

  /**
   * Email admin : Nouvelle réservation
   */
  async sendAdminNewBooking(booking: BookingWithRoom): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Nouvelle réservation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #2c3e50; padding: 20px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff;">Nouvelle réservation</h2>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="8">
                <tr>
                  <td style="font-weight: bold;">Client :</td>
                  <td>${booking.customerName}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Email :</td>
                  <td>${booking.customerEmail}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Salle :</td>
                  <td>${booking.room.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Date :</td>
                  <td>${this.formatDate(booking.date)}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Horaire :</td>
                  <td>${booking.startTime} - ${booking.endTime}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Prix :</td>
                  <td style="font-weight: bold; color: #27ae60;">${booking.totalPrice.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">ID :</td>
                  <td style="font-family: monospace; font-size: 11px;">${booking.id}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; text-align: center;">
                <a href="${FRONTEND_URL}/admin/bookings" style="display: inline-block; background-color: #3498db; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">
                  Voir dans l'admin
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail(ADMIN_EMAIL, `Nouvelle réservation - ${booking.room.name}`, html);
  }

  /**
   * Email admin : Annulation de réservation
   */
  async sendAdminBookingCancellation(booking: BookingWithRoom): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Annulation de réservation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #e74c3c; padding: 20px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff;">Annulation de réservation</h2>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px; color: #e74c3c; font-weight: bold;">
                Une réservation a été annulée
              </p>
              
              <table width="100%" cellpadding="8">
                <tr>
                  <td style="font-weight: bold;">Client :</td>
                  <td>${booking.customerName}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Salle :</td>
                  <td>${booking.room.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Date :</td>
                  <td>${this.formatDate(booking.date)}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Horaire :</td>
                  <td>${booking.startTime} - ${booking.endTime}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Montant :</td>
                  <td>${booking.totalPrice.toFixed(2)} €</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; text-align: center;">
                <a href="${FRONTEND_URL}/admin/bookings" style="display: inline-block; background-color: #e74c3c; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">
                  Voir dans l'admin
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendEmail(ADMIN_EMAIL, `Annulation - ${booking.room.name}`, html);
  }
}

export const emailService = new EmailService();
