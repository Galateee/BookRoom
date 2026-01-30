import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../config/database";
import { stripeService } from "../services/stripe.service";
import { emailService } from "../services/email.service";

/**
 * Récupérer toutes les salles (actives et désactivées) pour l'admin
 */
export async function getAllRooms(req: AuthRequest, res: Response): Promise<void> {
  try {
    const rooms = await prisma.room.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        capacity: true,
        pricePerHour: true,
        equipments: true,
        imageUrl: true,
        isActive: true,
      },
      orderBy: { name: "asc" },
    });

    res.json({
      success: true,
      data: rooms,
      meta: { total: rooms.length },
    });
  } catch (error) {
    console.error("Error fetching all rooms:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Erreur lors de la récupération des salles",
      },
    });
  }
}

/**
 * Créer une nouvelle salle
 */
export async function createRoom(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, description, capacity, pricePerHour, equipments, imageUrl, images } = req.body;

    // Validation des données
    if (!name || !capacity || !pricePerHour) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Nom, capacité et prix par heure sont requis",
        },
      });
      return;
    }

    if (capacity < 1) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_CAPACITY",
          message: "La capacité doit être d'au moins 1 personne",
        },
      });
      return;
    }

    if (pricePerHour < 0) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_PRICE",
          message: "Le prix doit être positif",
        },
      });
      return;
    }

    const room = await prisma.room.create({
      data: {
        name,
        description: description || "",
        capacity,
        pricePerHour,
        equipments: equipments || [],
        imageUrl: imageUrl || "",
        images: images || [],
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la salle:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la création de la salle",
      },
    });
  }
}

/**
 * Mettre à jour une salle existante
 */
export async function updateRoom(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { name, description, capacity, pricePerHour, equipments, imageUrl, images, isActive } =
      req.body;

    const existingRoom = await prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      res.status(404).json({
        success: false,
        error: {
          code: "ROOM_NOT_FOUND",
          message: "Salle non trouvée",
        },
      });
      return;
    }

    // Validation des données si fournies
    if (capacity !== undefined && capacity < 1) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_CAPACITY",
          message: "La capacité doit être d'au moins 1 personne",
        },
      });
      return;
    }

    if (pricePerHour !== undefined && pricePerHour < 0) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_PRICE",
          message: "Le prix doit être positif",
        },
      });
      return;
    }

    const room = await prisma.room.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(capacity !== undefined && { capacity }),
        ...(pricePerHour !== undefined && { pricePerHour }),
        ...(equipments !== undefined && { equipments }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(images !== undefined && { images }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la salle:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la mise à jour de la salle",
      },
    });
  }
}

/**
 * Toggle l'état actif/désactivé d'une salle
 */
export async function toggleRoomStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;

    const existingRoom = await prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      res.status(404).json({
        success: false,
        error: {
          code: "ROOM_NOT_FOUND",
          message: "Salle non trouvée",
        },
      });
      return;
    }

    const room = await prisma.room.update({
      where: { id },
      data: { isActive: !existingRoom.isActive },
    });

    res.json({
      success: true,
      message: room.isActive
        ? "Salle activée avec succès"
        : "Salle désactivée avec succès. Elle n'est plus visible par les utilisateurs.",
      data: room,
    });
  } catch (error) {
    console.error("Erreur lors du changement d'état:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors du changement d'état de la salle",
      },
    });
  }
}

/**
 * Supprimer définitivement une salle (seulement si désactivée et aucune réservation)
 */
export async function deleteRoom(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;

    // Vérifier que la salle existe
    const existingRoom = await prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      res.status(404).json({
        success: false,
        error: {
          code: "ROOM_NOT_FOUND",
          message: "Salle non trouvée",
        },
      });
      return;
    }

    if (existingRoom.isActive) {
      res.status(400).json({
        success: false,
        error: {
          code: "ROOM_STILL_ACTIVE",
          message: "Veuillez d'abord désactiver la salle avant de la supprimer",
        },
      });
      return;
    }

    const bookingsCount = await prisma.booking.count({
      where: {
        roomId: id,
      },
    });

    if (bookingsCount > 0) {
      res.status(400).json({
        success: false,
        error: {
          code: "HAS_BOOKINGS",
          message: `Impossible de supprimer : ${bookingsCount} réservation(s) existent pour cette salle. Attendez que toutes les réservations soient terminées.`,
        },
      });
      return;
    }

    await prisma.room.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Salle supprimée définitivement",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la salle:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la suppression de la salle",
      },
    });
  }
}

/**
 * Récupérer toutes les réservations (admin)
 */
export async function getAllBookings(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, roomId, startDate, endDate } = req.query;

    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(roomId && { roomId: roomId as string }),
        ...(startDate &&
          endDate && {
            date: {
              gte: startDate as string,
              lte: endDate as string,
            },
          }),
      },
      include: {
        room: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      roomName: booking.room.name,
    }));

    res.json({
      success: true,
      data: formattedBookings,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la récupération des réservations",
      },
    });
  }
}

/**
 * Mettre à jour le statut d'une réservation (admin)
 */
export async function updateBookingStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const validStatuses = [
      "CONFIRMED",
      "CANCELLED_BY_ADMIN",
      "COMPLETED",
      "CHECKED_IN",
      "IN_PROGRESS",
      "NO_SHOW",
    ];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_STATUS",
          message: `Le statut doit être l'un des suivants: ${validStatuses.join(", ")}`,
        },
      });
      return;
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      res.status(404).json({
        success: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Réservation non trouvée",
        },
      });
      return;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        room: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la mise à jour du statut",
      },
    });
  }
}

/**
 * Modifier une réservation (admin) - sans vérification userId
 */
export async function updateBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { date, startTime, endTime, numberOfPeople } = req.body;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      res.status(404).json({
        success: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Réservation non trouvée",
        },
      });
      return;
    }

    const room = await prisma.room.findUnique({
      where: { id: existingBooking.roomId },
    });

    if (!room) {
      res.status(404).json({
        success: false,
        error: {
          code: "ROOM_NOT_FOUND",
          message: "Salle non trouvée",
        },
      });
      return;
    }

    const cancelledStatuses = [
      "CANCELLED_BY_USER",
      "CANCELLED_BY_ADMIN",
      "CANCELLED_NO_PAYMENT",
      "REFUNDED",
    ];
    if (
      cancelledStatuses.includes(existingBooking.status) ||
      existingBooking.status === "COMPLETED"
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: "BOOKING_NOT_MODIFIABLE",
          message: "Cette réservation ne peut plus être modifiée",
        },
      });
      return;
    }

    if (date || startTime || endTime) {
      const newDate = date || existingBooking.date;
      const newStartTime = startTime || existingBooking.startTime;
      const newEndTime = endTime || existingBooking.endTime;

      const conflict = await prisma.booking.findFirst({
        where: {
          roomId: existingBooking.roomId,
          date: newDate,
          id: { not: id },
          status: {
            in: [
              "PENDING_PAYMENT",
              "PAYMENT_RECEIVED",
              "CONFIRMED",
              "MODIFIED",
              "CHECKED_IN",
              "IN_PROGRESS",
            ],
          },
          OR: [
            { startTime: { lte: newStartTime }, endTime: { gt: newStartTime } },
            { startTime: { lt: newEndTime }, endTime: { gte: newEndTime } },
            { startTime: { gte: newStartTime }, endTime: { lte: newEndTime } },
          ],
        },
      });

      if (conflict) {
        res.status(409).json({
          success: false,
          error: {
            code: "TIME_CONFLICT",
            message: "Ce créneau est déjà réservé",
          },
        });
        return;
      }
    }

    const finalStartTime = startTime || existingBooking.startTime;
    const finalEndTime = endTime || existingBooking.endTime;
    const startHour = parseInt(finalStartTime.split(":")[0]);
    const endHour = parseInt(finalEndTime.split(":")[0]);
    const hours = endHour - startHour;
    const totalPrice = hours * room.pricePerHour;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        date: date || existingBooking.date,
        originalDate: ((existingBooking as any).originalDate || existingBooking.date) as any,
        startTime: finalStartTime,
        endTime: finalEndTime,
        numberOfPeople: numberOfPeople || existingBooking.numberOfPeople,
        totalPrice,
        status: "MODIFIED",
      },
      include: {
        room: true,
      },
    });

    emailService.sendBookingModification(updatedBooking as any).catch((error) => {
      console.error("Erreur envoi email modification:", error);
    });

    res.json({
      success: true,
      data: {
        bookingId: updatedBooking.id,
        roomName: room.name,
        date: updatedBooking.date,
        startTime: updatedBooking.startTime,
        endTime: updatedBooking.endTime,
        totalPrice: updatedBooking.totalPrice,
        status: updatedBooking.status,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la modification de la réservation:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la modification de la réservation",
      },
    });
  }
}

/**
 * Annuler une réservation (admin)
 */
export async function cancelBooking(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
        refunds: true,
      },
    });

    if (!existingBooking) {
      res.status(404).json({
        success: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Réservation non trouvée",
        },
      });
      return;
    }

    const cancelledStatuses = [
      "CANCELLED_BY_USER",
      "CANCELLED_BY_ADMIN",
      "CANCELLED_NO_PAYMENT",
      "REFUNDED",
    ];
    if (cancelledStatuses.includes(existingBooking.status)) {
      res.status(400).json({
        success: false,
        error: {
          code: "ALREADY_CANCELLED",
          message: "Cette réservation est déjà annulée",
        },
      });
      return;
    }

    if (existingBooking.refunds && existingBooking.refunds.length > 0) {
      res.status(400).json({
        success: false,
        error: {
          code: "ALREADY_REFUNDED",
          message: "Cette réservation a déjà été remboursée",
        },
      });
      return;
    }

    if (existingBooking.stripePaymentId) {
      const refundAmount = stripeService.calculateRefundAmount(existingBooking);

      if (refundAmount > 0) {
        const stripeRefund = await stripeService.createRefund(
          existingBooking.stripePaymentId,
          refundAmount,
          "CANCELLED_BY_ADMIN"
        );

        await prisma.refund.create({
          data: {
            bookingId: id,
            amount: refundAmount,
            amountCents: Math.round(refundAmount * 100),
            stripeRefundId: stripeRefund.id,
            reason: "CANCELLED_BY_ADMIN",
            status: "SUCCEEDED",
            processedAt: new Date(),
          },
        });

        if (refundAmount === existingBooking.totalPrice) {
          await prisma.payment.update({
            where: { bookingId: id },
            data: { status: "REFUNDED" },
          });
        } else {
          await prisma.payment.update({
            where: { bookingId: id },
            data: { status: "PARTIALLY_REFUNDED" },
          });
        }

        const booking = await prisma.booking.update({
          where: { id },
          data: {
            status: "REFUNDED",
            stripeRefundId: stripeRefund.id,
            cancelledAt: new Date(),
          },
          include: {
            room: true,
          },
        });

        Promise.all([
          emailService.sendBookingCancellation(booking),
          emailService.sendAdminBookingCancellation(booking),
        ]).catch((error) => {
          console.error("Erreur lors de l'envoi des emails:", error);
        });

        res.json({
          success: true,
          data: booking,
          message: `Réservation annulée et remboursement de ${refundAmount}€ effectué`,
        });
      } else {
        const booking = await prisma.booking.update({
          where: { id },
          data: {
            status: "CANCELLED_BY_ADMIN",
            cancelledAt: new Date(),
          },
          include: {
            room: true,
          },
        });

        Promise.all([
          emailService.sendBookingCancellation(booking),
          emailService.sendAdminBookingCancellation(booking),
        ]).catch((error) => {
          console.error("Erreur lors de l'envoi des emails:", error);
        });

        res.json({
          success: true,
          data: booking,
          message: "Réservation annulée (aucun remboursement - délai < 24h)",
        });
      }
    } else {
      const booking = await prisma.booking.update({
        where: { id },
        data: {
          status: "CANCELLED_BY_ADMIN",
          cancelledAt: new Date(),
        },
        include: {
          room: true,
        },
      });

      Promise.all([
        emailService.sendBookingCancellation(booking),
        emailService.sendAdminBookingCancellation(booking),
      ]).catch((error) => {
        console.error("Erreur lors de l'envoi des emails:", error);
      });

      res.json({
        success: true,
        data: booking,
        message: "Réservation annulée (aucun paiement trouvé)",
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de l'annulation de la réservation",
      },
    });
  }
}

/**
 * Obtenir des statistiques globales
 */
export async function getStatistics(req: AuthRequest, res: Response): Promise<void> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toISOString()
      .split("T")[0];
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      .toISOString()
      .split("T")[0];

    // Nombre total de salles actives
    const totalRooms = await prisma.room.count({
      where: { isActive: true },
    });

    // Nombre total de réservations
    const totalBookings = await prisma.booking.count();

    // Réservations ce mois-ci
    const currentMonthBookings = await prisma.booking.count({
      where: {
        date: { gte: firstDayOfMonth },
      },
    });

    // Réservations le mois dernier
    const lastMonthBookings = await prisma.booking.count({
      where: {
        date: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth,
        },
      },
    });

    // Calcul de la croissance mensuelle
    let monthlyGrowth = 0;
    if (lastMonthBookings > 0) {
      monthlyGrowth = ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100;
    } else if (currentMonthBookings > 0) {
      monthlyGrowth = 100;
    }

    // Revenu total
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ["CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED"] as const },
      },
      select: { totalPrice: true },
    });
    const totalRevenue = bookings.reduce(
      (sum: number, b: { totalPrice: number }) => sum + b.totalPrice,
      0
    );

    // Utilisateurs actifs (unique userId ayant fait au moins une réservation)
    const uniqueUsers = await prisma.booking.findMany({
      select: { userId: true },
      distinct: ["userId"],
    });

    // Top 5 salles les plus réservées (toutes réservations sauf annulées)
    const bookingsByRoom = await prisma.booking.groupBy({
      by: ["roomId"],
      _count: { id: true },
      where: {
        status: {
          notIn: ["CANCELLED_BY_USER", "CANCELLED_BY_ADMIN", "CANCELLED_NO_PAYMENT", "REFUNDED"],
        },
      },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const topRooms = await Promise.all(
      bookingsByRoom.map(async (item) => {
        const room = await prisma.room.findUnique({
          where: { id: item.roomId },
          select: { id: true, name: true, imageUrl: true },
        });
        return {
          ...room,
          bookings: item._count.id,
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalRooms,
        totalBookings,
        totalRevenue,
        activeUsers: uniqueUsers.length,
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
        topRooms,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la récupération des statistiques",
      },
    });
  }
}
