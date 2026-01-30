import { PrismaClient } from "@prisma/client";
import { emailService } from "../services/email.service";

const prisma = new PrismaClient();

/**
 * Script pour envoyer des rappels de réservation (J-1)
 * À exécuter via cron job quotidien :
 * - 0 9 * * * cd /app && npm run reminders
 */
async function sendDailyReminders() {
  try {
    console.log("Démarrage envoi des rappels...");

    // Date de demain (YYYY-MM-DD)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    console.log(`Recherche des réservations pour le ${tomorrowStr}...`);

    // Récupérer toutes les réservations confirmées de demain
    const bookings = await prisma.booking.findMany({
      where: {
        date: tomorrowStr,
        status: {
          in: ["CONFIRMED", "MODIFIED"],
        },
      },
      include: {
        room: true,
      },
    });

    console.log(`${bookings.length} réservation(s) trouvée(s)`);

    if (bookings.length === 0) {
      console.log("Aucun rappel à envoyer aujourd'hui");
      return;
    }

    // Envoyer les rappels
    let successCount = 0;
    let errorCount = 0;

    for (const booking of bookings) {
      try {
        await emailService.sendBookingReminder(booking);
        successCount++;
        console.log(`Rappel envoyé à ${booking.customerEmail}`);
      } catch (error) {
        errorCount++;
        console.error(
          `Erreur envoi rappel pour ${booking.id}:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    console.log(
      `\nRésumé: ${successCount} envoyé(s), ${errorCount} erreur(s) sur ${bookings.length} total`
    );
  } catch (error) {
    console.error("Erreur critique:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
sendDailyReminders()
  .then(() => {
    console.log("Script terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erreur fatale:", error);
    process.exit(1);
  });
