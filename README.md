# BookRoom - Frontend

Application React pour la réservation de salles de réunion.

## 🛠️ Technologies

- **Framework**: React 19
- **Langage**: TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **Authentification**: Clerk
- **Styling**: CSS Modules

## 📁 Structure du projet

```
BookRoom/
├── .env.local              # Clé Clerk publique
├── src/
│   ├── main.tsx            # Point d'entrée + providers
│   ├── App.tsx             # Configuration des routes
│   ├── components/
│   │   ├── auth/           # Composants d'authentification
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ApiAuthProvider.tsx
│   │   ├── common/         # Composants réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── layout/         # Layout et navigation
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── booking/        # Composants métier
│   │       ├── BookingForm.tsx
│   │       ├── BookingCard.tsx
│   │       ├── RoomCard.tsx
│   │       └── SlotPicker.tsx
│   ├── pages/              # Pages de l'application
│   │   ├── RoomList.tsx
│   │   ├── RoomDetail.tsx
│   │   ├── MyBookings.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useRooms.ts
│   │   ├── useRoom.ts
│   │   ├── useBooking.ts
│   │   ├── useMyBookings.ts
│   │   └── useIsAdmin.ts
│   ├── services/           # Communication API
│   │   └── api.service.ts
│   └── types/              # Types TypeScript
│       └── index.ts
└── doc/
    └── CONCEPTION.md       # Document de conception
```

## 🚀 Démarrage

### Prérequis

- Node.js 20+
- Backend API en cours d'exécution (voir BookRoom API)

### Installation

```bash
# Installer les dépendances
npm install

# Configurer Clerk
cp .env.example .env.local
# Ajouter votre clé VITE_CLERK_PUBLISHABLE_KEY
```

### Démarrage

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`

## 📱 Fonctionnalités

### Authentification (Clerk)

- ✅ Inscription avec magic link (email)
- ✅ Connexion sécurisée
- ✅ Session persistante
- ✅ Déconnexion

### Consultation des salles

- ✅ Liste des salles disponibles
- ✅ Détail d'une salle (équipements, capacité, prix)
- ✅ Créneaux disponibles par date

### Réservation

- ✅ Formulaire de réservation
- ✅ Sélection de créneau horaire
- ✅ Validation des données
- ✅ Confirmation de réservation

### Mes réservations

- ✅ Liste de mes réservations
- ✅ Statut en temps réel
- ✅ Historique complet
- ✅ Annulation de réservation

### Dashboard Admin

- ✅ Système de rôles (via Clerk metadata)
- ✅ Navigation admin dédiée
- ✅ Gestion des salles (CRUD)
- ✅ Vue de toutes les réservations
- ✅ Statistiques et KPIs
- ✅ Accès protégé par rôle

## 🧭 Routes

| Route          | Accès           | Description              |
| -------------- | --------------- | ------------------------ |
| `/`            | Public          | Page d'accueil           |
| `/sign-in`     | Public          | Connexion                |
| `/sign-up`     | Public          | Inscription              |
| `/rooms`       | Protégé         | Liste des salles         |
| `/rooms/:id`   | Protégé         | Détail d'une salle       |
| `/my-bookings` | Protégé         | Mes réservations         |
| `/admin`       | Admin seulement | Dashboard administrateur |

## 📝 Scripts npm

```bash
npm run dev      # Démarrage en développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification ESLint
```

## 👤 Configuration Admin

Pour donner le rôle admin à un utilisateur :

1. Connectez-vous sur [dashboard.clerk.com](https://dashboard.clerk.com)
2. Allez dans **Users**
3. Sélectionnez l'utilisateur
4. Onglet **Metadata** > **Public metadata**
5. Ajoutez : `{"role": "admin"}`
6. Sauvegardez

L'utilisateur aura maintenant accès au lien **Admin** dans le header.

## 🎨 Design System

### Composants UI

- `Button` - Bouton avec variantes (primary, secondary, danger)
- `Input` - Champ de saisie avec label et erreur
- `LoadingSpinner` - Indicateur de chargement
- `ErrorMessage` - Affichage d'erreurs avec retry
- `EmptyState` - État vide avec action

### Conventions CSS

- BEM (Block Element Modifier)
- Variables CSS pour les couleurs et espacements
- Responsive design (mobile-first)

---

Created with ❤️
