# 🚀 PHASE 1 - Plan d'Action Détaillé
## MVP : Authentification + Backend Réel

**Objectif :** Transformer l'application de démonstration en une application fonctionnelle avec authentification et backend réel.

**Durée estimée :** 40h

**Date de début :** 20 janvier 2026

---

## 📦 Livrables attendus

- ✅ Authentification fonctionnelle via Clerk (magic link)
- ✅ Routes protégées côté frontend
- ✅ Backend Node.js + Express + PostgreSQL opérationnel
- ✅ API REST sécurisée avec authentification JWT
- ✅ Frontend connecté au backend réel
- ✅ Migration de données du mock vers PostgreSQL

---

## 🎯 Tâches détaillées

### **PARTIE 1 : Setup & Configuration (8h)**

#### 1.1 Créer un compte Clerk (0.5h)
- [ ] S'inscrire sur [clerk.com](https://clerk.com)
- [ ] Créer une nouvelle application "BookRoom"
- [ ] Configurer le magic link comme méthode de connexion
- [ ] Récupérer les clés API (Publishable Key + Secret Key)
- [ ] Configurer les redirections URLs

**Ressources :**
- Documentation Clerk : https://clerk.com/docs/quickstarts/react
- Dashboard Clerk : https://dashboard.clerk.com

---

#### 1.2 Configurer les variables d'environnement (0.5h)

**Créer `.env.local` (frontend) :**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_API_URL=http://localhost:3001/api
```

**Créer `.env` (backend - à créer) :**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bookroom
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
PORT=3001
NODE_ENV=development
```

**Mettre à jour `.gitignore` :**
```gitignore
.env
.env.local
.env*.local
```

---

#### 1.3 Installer PostgreSQL localement (1h)

**Option A : Docker (recommandé)**
```bash
docker run --name bookroom-postgres \
  -e POSTGRES_USER=bookroom \
  -e POSTGRES_PASSWORD=bookroom123 \
  -e POSTGRES_DB=bookroom \
  -p 5432:5432 \
  -d postgres:15-alpine
```

**Option B : Installation native**
- Télécharger PostgreSQL : https://www.postgresql.org/download/windows/
- Créer la database `bookroom`

**Vérifier la connexion :**
```bash
psql -h localhost -U bookroom -d bookroom
```

---

#### 1.4 Initialiser le projet backend (2h)

**Structure du projet :**
```
TP FRONTEND/
├── BookRoom/           # Frontend existant
└── bookroom-api/       # Nouveau backend
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   └── server.ts
    ├── prisma/
    │   └── schema.prisma
    ├── package.json
    ├── tsconfig.json
    └── .env
```

**Commandes d'initialisation :**
```bash
cd "d:\Robin\Downloads\YNOV\fullstack\TP FRONTEND"
mkdir bookroom-api
cd bookroom-api
npm init -y
npm install express cors dotenv
npm install @clerk/clerk-sdk-node
npm install @prisma/client
npm install -D typescript @types/express @types/cors @types/node
npm install -D prisma ts-node nodemon
npx tsc --init
npx prisma init
```

---

#### 1.5 Configurer Prisma Schema (2h)

**Créer `prisma/schema.prisma` :**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Room {
  id            String    @id @default(uuid())
  name          String
  description   String
  capacity      Int
  pricePerHour  Float
  equipments    String[]
  imageUrl      String
  images        String[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  bookings      Booking[]
  availableSlots Json?    // Stockage temporaire des slots disponibles

  @@map("rooms")
}

model Booking {
  id            String   @id @default(uuid())
  roomId        String
  room          Room     @relation(fields: [roomId], references: [id])
  userId        String   // Clerk User ID
  date          String
  startTime     String
  endTime       String
  customerName  String
  customerEmail String
  customerPhone String
  numberOfPeople Int
  totalPrice    Float
  status        BookingStatus @default(CONFIRMED)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("bookings")
  @@index([userId])
  @@index([roomId])
  @@index([date])
}

enum BookingStatus {
  CONFIRMED
  MODIFIED
  CANCELLED
  COMPLETED
}
```

**Migrer la base de données :**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

#### 1.6 Seeder : Migrer les données du mock (2h)

**Créer `prisma/seed.ts` :**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Nettoyer les données existantes
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  // Créer les salles (reprendre les données du mock)
  const rooms = [
    {
      id: 'room-001',
      name: 'Salle Innovation',
      description: 'Salle moderne équipée pour les réunions créatives',
      capacity: 10,
      pricePerHour: 50,
      equipments: ['projector', 'whiteboard', 'wifi', 'video-conference'],
      imageUrl: '/images/room-001.jpg',
      images: ['/images/room-001-1.jpg', '/images/room-001-2.jpg'],
      availableSlots: {
        "2026-01-20": ["09:00", "10:00", "14:00", "15:00", "16:00"],
        "2026-01-21": ["09:00", "10:00", "11:00", "14:00", "15:00"]
      }
    },
    // ... ajouter toutes les salles du mock
  ];

  for (const room of rooms) {
    await prisma.room.create({ data: room });
  }

  console.log('✅ Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Ajouter dans `package.json` :**
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

**Exécuter le seed :**
```bash
npx prisma db seed
```

---

### **PARTIE 2 : Backend API (12h)**

#### 2.1 Créer le serveur Express de base (2h)

**Créer `src/server.ts` :**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roomRoutes from './routes/room.routes';
import bookingRoutes from './routes/booking.routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

#### 2.2 Middleware d'authentification Clerk (2h)

**Créer `src/middlewares/auth.middleware.ts` :**
```typescript
import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token d\'authentification manquant'
        }
      });
    }

    // Vérifier le token avec Clerk
    const session = await clerkClient.sessions.verifySession(
      token,
      process.env.CLERK_PUBLISHABLE_KEY!
    );

    req.userId = session.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token invalide ou expiré'
      }
    });
  }
};
```

---

#### 2.3 Routes & Controllers pour Rooms (3h)

**Créer `src/routes/room.routes.ts` :**
```typescript
import { Router } from 'express';
import { getRooms, getRoomById } from '../controllers/room.controller';

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);

export default router;
```

**Créer `src/controllers/room.controller.ts` :**
```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      select: {
        id: true,
        name: true,
        capacity: true,
        pricePerHour: true,
        equipments: true,
        imageUrl: true
      }
    });

    res.json({
      success: true,
      data: rooms,
      meta: { total: rooms.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la récupération des salles'
      }
    });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({ where: { id } });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROOM_NOT_FOUND',
          message: 'La salle demandée n\'existe pas'
        }
      });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la récupération de la salle'
      }
    });
  }
};
```

---

#### 2.4 Routes & Controllers pour Bookings (protégées) (5h)

**Créer `src/routes/booking.routes.ts` :**
```typescript
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import {
  createBooking,
  getMyBookings,
  getBookingById
} from '../controllers/booking.controller';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

router.post('/', createBooking);
router.get('/me', getMyBookings);
router.get('/:id', getBookingById);

export default router;
```

**Créer `src/controllers/booking.controller.ts` :**
```typescript
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, date, startTime, endTime, customerName, customerEmail, customerPhone, numberOfPeople } = req.body;

    // Validation
    if (!roomId || !date || !startTime || !endTime || !customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Champs requis manquants'
        }
      });
    }

    // Vérifier que la salle existe
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROOM_NOT_FOUND',
          message: 'La salle demandée n\'existe pas'
        }
      });
    }

    // Vérifier les conflits de réservation
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        date,
        status: { in: ['CONFIRMED', 'MODIFIED'] },
        OR: [
          { startTime: { lte: startTime }, endTime: { gt: startTime } },
          { startTime: { lt: endTime }, endTime: { gte: endTime } },
          { startTime: { gte: startTime }, endTime: { lte: endTime } }
        ]
      }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'TIME_CONFLICT',
          message: 'Ce créneau est déjà réservé'
        }
      });
    }

    // Calculer le prix
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const hours = end - start;
    const totalPrice = hours * room.pricePerHour;

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        roomId,
        userId: req.userId!,
        date,
        startTime,
        endTime,
        customerName,
        customerEmail,
        customerPhone,
        numberOfPeople,
        totalPrice,
        status: 'CONFIRMED'
      }
    });

    res.status(201).json({
      success: true,
      data: {
        bookingId: booking.id,
        roomName: room.name,
        ...booking
      },
      message: 'Réservation créée avec succès'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la création de la réservation'
      }
    });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId! },
      include: { room: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const formattedBookings = bookings.map(b => ({
      bookingId: b.id,
      roomName: b.room.name,
      date: b.date,
      startTime: b.startTime,
      endTime: b.endTime,
      totalPrice: b.totalPrice,
      status: b.status.toLowerCase(),
      createdAt: b.createdAt.toISOString()
    }));

    res.json({
      success: true,
      data: formattedBookings,
      meta: { total: formattedBookings.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la récupération des réservations'
      }
    });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findFirst({
      where: { id, userId: req.userId! },
      include: { room: true }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'BOOKING_NOT_FOUND',
          message: 'Réservation non trouvée'
        }
      });
    }

    res.json({
      success: true,
      data: {
        bookingId: booking.id,
        roomName: booking.room.name,
        ...booking
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Erreur lors de la récupération de la réservation'
      }
    });
  }
};
```

---

### **PARTIE 3 : Frontend - Intégration Clerk (12h)**

#### 3.1 Installation des dépendances Clerk (0.5h)

```bash
cd BookRoom
npm install @clerk/clerk-react
```

---

#### 3.2 Configurer ClerkProvider (1h)

**Modifier `src/main.tsx` :**
```typescript
import { ClerkProvider } from '@clerk/clerk-react';
import { frFR } from '@clerk/localizations';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      localization={frFR}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
```

---

#### 3.3 Créer les pages d'authentification (3h)

**Créer `src/pages/SignIn.tsx` :**
```typescript
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export default function SignIn() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <ClerkSignIn 
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/rooms"
      />
    </div>
  );
}
```

**Créer `src/pages/SignUp.tsx` :**
```typescript
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

export default function SignUp() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <ClerkSignUp 
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/rooms"
      />
    </div>
  );
}
```

**Créer `src/pages/LandingPage.tsx` :**
```typescript
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="landing-page">
      <h1>BookRoom - Réservez votre salle de réunion</h1>
      <p>La solution simple pour réserver des espaces de travail</p>
      
      {isSignedIn ? (
        <Link to="/rooms">
          <button>Voir les salles disponibles</button>
        </Link>
      ) : (
        <div>
          <Link to="/sign-in">
            <button>Se connecter</button>
          </Link>
          <Link to="/sign-up">
            <button>S'inscrire</button>
          </Link>
        </div>
      )}
    </div>
  );
}
```

---

#### 3.4 Protéger les routes existantes (2h)

**Créer `src/components/auth/ProtectedRoute.tsx` :**
```typescript
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
```

**Mettre à jour `src/App.tsx` :**
```typescript
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import MyBookings from './pages/MyBookings';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />
      
      <Route element={<Layout />}>
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <ProtectedRoute>
              <RoomDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
```

---

#### 3.5 Mettre à jour le Header avec UserButton (1.5h)

**Modifier `src/components/layout/Header.tsx` :**
```typescript
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import './Header.css';

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>BookRoom</h1>
        </Link>

        <nav className="nav">
          {isSignedIn ? (
            <>
              <Link to="/rooms">Salles</Link>
              <Link to="/my-bookings">Mes réservations</Link>
              <div className="user-section">
                <span>Bonjour, {user?.firstName}</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <>
              <Link to="/sign-in">Connexion</Link>
              <Link to="/sign-up">Inscription</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
```

---

#### 3.6 Mettre à jour le service API avec authentification (4h)

**Modifier `src/services/api.service.ts` :**
```typescript
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Hook personnalisé pour les requêtes authentifiées
export const useApiClient = () => {
  const { getToken } = useAuth();

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  };

  return {
    // Rooms (publiques)
    getRooms: () => fetch(`${API_URL}/rooms`).then(r => r.json()),
    getRoomById: (id: string) => fetch(`${API_URL}/rooms/${id}`).then(r => r.json()),

    // Bookings (authentifiées)
    createBooking: (data: any) => 
      fetchWithAuth('/bookings', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    
    getMyBookings: () => fetchWithAuth('/bookings/me'),
    
    getBookingById: (id: string) => fetchWithAuth(`/bookings/${id}`)
  };
};
```

---

#### 3.7 Mettre à jour les hooks pour utiliser le nouveau service (2h)

**Modifier `src/hooks/useBooking.ts` :**
```typescript
import { useState } from 'react';
import { useApiClient } from '../services/api.service';
import { BookingFormData } from '../types';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient();

  const createBooking = async (data: BookingFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.createBooking(data);
      return response;
    } catch (err: any) {
      setError(err.error?.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};
```

**Faire de même pour `useMyBookings.ts`, `useRooms.ts`, `useRoom.ts`**

---

### **PARTIE 4 : Tests & Validation (8h)**

#### 4.1 Tester l'authentification (2h)
- [ ] Inscription d'un nouvel utilisateur
- [ ] Réception du magic link par email
- [ ] Connexion réussie
- [ ] Déconnexion
- [ ] Tentative d'accès sans authentification (redirection)

---

#### 4.2 Tester le backend (3h)
- [ ] GET /api/rooms → liste des salles
- [ ] GET /api/rooms/:id → détail d'une salle
- [ ] POST /api/bookings (sans token) → erreur 401
- [ ] POST /api/bookings (avec token) → réservation créée
- [ ] GET /api/bookings/me → mes réservations
- [ ] Vérifier la détection de conflits de créneaux

**Utiliser Thunder Client ou Postman pour tester l'API**

---

#### 4.3 Tester le flux complet frontend (2h)
- [ ] Parcours complet : inscription → connexion → consultation → réservation
- [ ] Vérifier les états de chargement
- [ ] Vérifier la gestion des erreurs
- [ ] Tester la navigation entre pages

---

#### 4.4 Documenter les changements (1h)
- [ ] Mettre à jour README.md avec nouvelles instructions
- [ ] Documenter les variables d'environnement
- [ ] Créer un guide de démarrage rapide

---

## 📋 Checklist de validation Phase 1

### Backend
- [ ] PostgreSQL installé et accessible
- [ ] Backend démarre sans erreur
- [ ] Migration Prisma réussie
- [ ] Seed de données fonctionnel
- [ ] Toutes les routes API répondent correctement
- [ ] Middleware d'authentification fonctionne

### Frontend
- [ ] Clerk configuré correctement
- [ ] Pages d'authentification fonctionnelles
- [ ] Routes protégées
- [ ] Header avec UserButton
- [ ] Service API mis à jour
- [ ] Aucune erreur de build

### Intégration
- [ ] Frontend se connecte au backend réel
- [ ] Authentification end-to-end fonctionnelle
- [ ] Création de réservation avec authentification
- [ ] Mes réservations s'affichent correctement

---

## 🚨 Points bloquants possibles

1. **Clerk magic link** : Vérifier que les emails arrivent bien (check spam)
2. **CORS** : S'assurer que le backend autorise `http://localhost:5173`
3. **PostgreSQL** : Vérifier que le port 5432 n'est pas déjà utilisé
4. **Variables d'environnement** : Double-check des clés API Clerk

---

## 📞 Ressources & Support

- **Clerk Documentation** : https://clerk.com/docs
- **Prisma Documentation** : https://www.prisma.io/docs
- **Express + TypeScript** : https://expressjs.com
- **Stack Overflow** : pour les problèmes spécifiques

---

## ⏭️ Prochaine étape

Une fois la Phase 1 validée, nous passerons à la **Phase 2 : Système de rôles + Dashboard admin**.

---

**Prêt à commencer ? Dis-moi par quelle tâche tu veux démarrer ! 🚀**
