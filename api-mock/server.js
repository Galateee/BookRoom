import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock data
let rooms = [
  {
    id: 'room-001',
    name: 'Salle Innovation',
    capacity: 10,
    pricePerHour: 50,
    equipments: ['projector', 'whiteboard', 'wifi', 'video-conference'],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    description: 'Salle moderne équipée pour les réunions créatives et les brainstormings.',
  },
  {
    id: 'room-002',
    name: 'Salle Collaboration',
    capacity: 6,
    pricePerHour: 35,
    equipments: ['whiteboard', 'wifi', 'coffee-machine'],
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    description: 'Espace cosy pour les petites équipes et les ateliers collaboratifs.',
  },
  {
    id: 'room-003',
    name: 'Salle Executive',
    capacity: 20,
    pricePerHour: 100,
    equipments: ['projector', 'whiteboard', 'wifi', 'video-conference', 'sound-system'],
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    description: 'Grande salle de conférence haut de gamme pour vos événements importants.',
  },
  {
    id: 'room-004',
    name: 'Salle Focus',
    capacity: 4,
    pricePerHour: 25,
    equipments: ['whiteboard', 'wifi'],
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
    description: 'Petit espace calme idéal pour les réunions en comité restreint.',
  },
  {
    id: 'room-005',
    name: 'Salle Créative',
    capacity: 8,
    pricePerHour: 45,
    equipments: ['projector', 'whiteboard', 'wifi', 'creative-tools'],
    imageUrl: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800',
    description: 'Espace inspirant avec des outils pour stimuler la créativité.',
  },
];

let bookings = [];
let bookingCounter = 1;

// GET /api/rooms - Récupérer la liste des salles
app.get('/api/rooms', (req, res) => {
  try {
    res.json({
      success: true,
      data: rooms,
      meta: {
        total: rooms.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Une erreur technique est survenue',
      },
    });
  }
});

// GET /api/rooms/:id - Récupérer le détail d'une salle
app.get('/api/rooms/:id', (req, res) => {
  try {
    const { id } = req.params;
    const room = rooms.find((r) => r.id === id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROOM_NOT_FOUND',
          message: "La salle demandée n'existe pas",
        },
      });
    }

    // Générer des créneaux disponibles pour les 7 prochains jours
    const availableSlots = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      availableSlots.push({
        date: date.toISOString().split('T')[0],
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      });
    }

    res.json({
      success: true,
      data: {
        ...room,
        availableSlots,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Une erreur technique est survenue',
      },
    });
  }
});

// POST /api/bookings - Créer une réservation
app.post('/api/bookings', (req, res) => {
  try {
    const {
      roomId,
      date,
      startTime,
      endTime,
      customerName,
      customerEmail,
      customerPhone,
      numberOfPeople,
    } = req.body;

    // Validation
    const errors = {};

    if (!roomId) errors.roomId = 'ID de salle requis';
    if (!date) errors.date = 'Date requise';
    if (!startTime) errors.startTime = 'Heure de début requise';
    if (!endTime) errors.endTime = 'Heure de fin requise';
    if (!customerName || customerName.length < 2) errors.customerName = 'Nom invalide';
    if (!customerEmail || !customerEmail.includes('@')) errors.customerEmail = 'Email invalide';
    if (!customerPhone) errors.customerPhone = 'Téléphone requis';
    if (!numberOfPeople) errors.numberOfPeople = 'Nombre de personnes requis';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Données de réservation invalides',
          details: errors,
        },
      });
    }

    // Vérifier que la salle existe
    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROOM_NOT_FOUND',
          message: "La salle sélectionnée n'existe pas",
        },
      });
    }

    // Vérifier la capacité
    if (numberOfPeople > room.capacity) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Données de réservation invalides',
          details: {
            numberOfPeople: `Le nombre de personnes dépasse la capacité de la salle (max: ${room.capacity})`,
          },
        },
      });
    }

    // Calculer le prix
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const hours = endHour - startHour + (endMinute - startMinute) / 60;
    const totalPrice = Math.round(hours * room.pricePerHour);

    // Créer la réservation
    const booking = {
      bookingId: `booking-${bookingCounter++}`,
      roomId,
      roomName: room.name,
      date,
      startTime,
      endTime,
      customerName,
      customerEmail,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Réservation confirmée avec succès',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Une erreur technique est survenue lors de la réservation',
      },
    });
  }
});

// GET /api/bookings - Récupérer les réservations par email
app.get('/api/bookings', (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_EMAIL',
          message: "L'email est requis pour consulter les réservations",
        },
      });
    }

    const userBookings = bookings.filter((b) => b.customerEmail === email);

    res.json({
      success: true,
      data: userBookings,
      meta: {
        total: userBookings.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Une erreur technique est survenue',
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints available:`);
  console.log(`   GET  http://localhost:${PORT}/api/rooms`);
  console.log(`   GET  http://localhost:${PORT}/api/rooms/:id`);
  console.log(`   POST http://localhost:${PORT}/api/bookings`);
  console.log(`   GET  http://localhost:${PORT}/api/bookings?email=xxx`);
});
