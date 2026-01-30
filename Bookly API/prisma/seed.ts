import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rooms = [
  {
    id: "room-001",
    name: "Salle Innovation",
    description:
      "Salle moderne et lumineuse, idéale pour les brainstormings et réunions créatives. Équipée des dernières technologies pour faciliter la collaboration.",
    capacity: 10,
    pricePerHour: 50,
    equipments: ["projector", "whiteboard", "wifi", "video-conference", "air-conditioning"],
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
    images: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
    ],
  },
  {
    id: "room-002",
    name: "Salle Executive",
    description:
      "Salle de réunion premium avec une vue panoramique. Parfaite pour les réunions de direction et les présentations importantes.",
    capacity: 8,
    pricePerHour: 75,
    equipments: [
      "projector",
      "smart-tv",
      "wifi",
      "video-conference",
      "coffee-machine",
      "air-conditioning",
    ],
    imageUrl: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800",
    images: [
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800",
      "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800",
    ],
  },
  {
    id: "room-003",
    name: "Salle Créativité",
    description:
      "Espace coloré et inspirant pour les sessions de design thinking et les ateliers créatifs. Tables modulables et matériel de création disponible.",
    capacity: 12,
    pricePerHour: 45,
    equipments: ["whiteboard", "wifi", "projector", "post-its", "markers"],
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
    images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800"],
  },
  {
    id: "room-004",
    name: "Salle Focus",
    description:
      "Petite salle intimiste pour les réunions confidentielles ou les entretiens. Insonorisation optimale pour une concentration maximale.",
    capacity: 4,
    pricePerHour: 30,
    equipments: ["wifi", "smart-tv", "air-conditioning"],
    imageUrl: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800",
    images: ["https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800"],
  },
  {
    id: "room-005",
    name: "Salle Formation",
    description:
      "Grande salle équipée pour les formations et workshops. Disposition en classe possible avec tableau interactif.",
    capacity: 20,
    pricePerHour: 80,
    equipments: [
      "projector",
      "interactive-board",
      "wifi",
      "microphone",
      "air-conditioning",
      "video-conference",
    ],
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
    images: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    ],
  },
  {
    id: "room-006",
    name: "Salle Zen",
    description:
      "Espace calme et apaisant, idéal pour les sessions de coaching ou les réunions nécessitant de la sérénité. Décoration épurée et plantes vertes.",
    capacity: 6,
    pricePerHour: 40,
    equipments: ["wifi", "whiteboard", "air-conditioning"],
    imageUrl: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800",
    images: ["https://images.unsplash.com/photo-1562564055-71e051d33c19?w=800"],
  },
];

// Fonction pour générer une date relative
function getDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
}

// Jeu de réservations de test
const testBookings = [
  // Réservation confirmée pour demain
  {
    roomId: "room-001",
    userId: "user_test_001",
    date: getDate(1),
    startTime: "09:00",
    endTime: "11:00",
    customerName: "Marie Dupont",
    customerEmail: "marie.dupont@example.com",
    customerPhone: "+33612345678",
    numberOfPeople: 6,
    totalPrice: 100,
    status: "CONFIRMED",
    stripeSessionId: "cs_test_001",
    stripePaymentId: "pi_test_001",
    paymentDate: new Date(),
  },
  // Réservation en cours aujourd'hui
  {
    roomId: "room-002",
    userId: "user_test_002",
    date: getDate(0),
    startTime: "14:00",
    endTime: "16:00",
    customerName: "Jean Martin",
    customerEmail: "jean.martin@example.com",
    customerPhone: "+33698765432",
    numberOfPeople: 5,
    totalPrice: 150,
    status: "IN_PROGRESS",
    stripeSessionId: "cs_test_002",
    stripePaymentId: "pi_test_002",
    paymentDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // Il y a 3h
  },
  // Réservation complétée hier
  {
    roomId: "room-003",
    userId: "user_test_003",
    date: getDate(-1),
    startTime: "10:00",
    endTime: "12:00",
    customerName: "Sophie Bernard",
    customerEmail: "sophie.bernard@example.com",
    customerPhone: "+33623456789",
    numberOfPeople: 8,
    totalPrice: 90,
    status: "COMPLETED",
    stripeSessionId: "cs_test_003",
    stripePaymentId: "pi_test_003",
    paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  // Réservation annulée par l'utilisateur
  {
    roomId: "room-004",
    userId: "user_test_004",
    date: getDate(5),
    startTime: "15:00",
    endTime: "17:00",
    customerName: "Pierre Dubois",
    customerEmail: "pierre.dubois@example.com",
    customerPhone: "+33634567890",
    numberOfPeople: 3,
    totalPrice: 60,
    status: "CANCELLED_BY_USER",
    stripeSessionId: "cs_test_004",
    stripePaymentId: "pi_test_004",
    stripeRefundId: "re_test_004",
    paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    cancelledAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  // Réservation future - semaine prochaine
  {
    roomId: "room-005",
    userId: "user_test_005",
    date: getDate(7),
    startTime: "09:00",
    endTime: "12:00",
    customerName: "Lucie Laurent",
    customerEmail: "lucie.laurent@example.com",
    customerPhone: "+33645678901",
    numberOfPeople: 15,
    totalPrice: 240,
    status: "CONFIRMED",
    stripeSessionId: "cs_test_005",
    stripePaymentId: "pi_test_005",
    paymentDate: new Date(),
  },
  // Réservation dans 3 jours
  {
    roomId: "room-006",
    userId: "user_test_006",
    date: getDate(3),
    startTime: "14:00",
    endTime: "16:00",
    customerName: "Thomas Moreau",
    customerEmail: "thomas.moreau@example.com",
    customerPhone: "+33656789012",
    numberOfPeople: 4,
    totalPrice: 80,
    status: "CONFIRMED",
    stripeSessionId: "cs_test_006",
    stripePaymentId: "pi_test_006",
    paymentDate: new Date(),
  },
  // Réservation paiement en attente
  {
    roomId: "room-001",
    userId: "user_test_007",
    date: getDate(10),
    startTime: "10:00",
    endTime: "12:00",
    customerName: "Émilie Robert",
    customerEmail: "emilie.robert@example.com",
    customerPhone: "+33667890123",
    numberOfPeople: 7,
    totalPrice: 100,
    status: "PENDING_PAYMENT",
    stripeSessionId: "cs_test_007",
  },
  // No-show hier
  {
    roomId: "room-002",
    userId: "user_test_008",
    date: getDate(-1),
    startTime: "16:00",
    endTime: "18:00",
    customerName: "Nicolas Petit",
    customerEmail: "nicolas.petit@example.com",
    numberOfPeople: 6,
    totalPrice: 150,
    status: "NO_SHOW",
    stripeSessionId: "cs_test_008",
    stripePaymentId: "pi_test_008",
    paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  // Réservation modifiée
  {
    roomId: "room-003",
    userId: "user_test_009",
    date: getDate(4),
    originalDate: getDate(2),
    startTime: "11:00",
    endTime: "13:00",
    customerName: "Camille Roux",
    customerEmail: "camille.roux@example.com",
    customerPhone: "+33678901234",
    numberOfPeople: 10,
    totalPrice: 90,
    status: "MODIFIED",
    stripeSessionId: "cs_test_009",
    stripePaymentId: "pi_test_009",
    paymentDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  // Checked-in en ce moment
  {
    roomId: "room-004",
    userId: "user_test_010",
    date: getDate(0),
    startTime: "09:00",
    endTime: "11:00",
    customerName: "Alexandre Simon",
    customerEmail: "alexandre.simon@example.com",
    customerPhone: "+33689012345",
    numberOfPeople: 4,
    totalPrice: 60,
    status: "CHECKED_IN",
    stripeSessionId: "cs_test_010",
    stripePaymentId: "pi_test_010",
    paymentDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Nettoyer les données existantes
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  console.log("🗑️  Cleared existing data");

  // Créer les salles
  for (const room of rooms) {
    await prisma.room.create({
      data: room,
    });
    console.log(`✅ Created room: ${room.name}`);
  }

  // Créer les réservations de test
  console.log("\n📅 Creating test bookings...");
  for (const booking of testBookings) {
    await prisma.booking.create({
      data: booking as any,
    });
    console.log(`✅ Created booking: ${booking.customerName} - ${booking.status}`);
  }

  console.log("");
  console.log("🎉 Seed completed successfully!");
  console.log(`📚 Created ${rooms.length} rooms`);
  console.log(`📅 Created ${testBookings.length} test bookings`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
