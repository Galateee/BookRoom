<div align="center">

# Bookly

**Système moderne de réservation de salles de réunion**

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[Installation](#-installation-rapide) • [Fonctionnalités](#-fonctionnalités)

</div>

---

## À propos

**Bookly** est une application full-stack de gestion et réservation de salles de réunion avec système de paiement intégré. Conçue pour simplifier la réservation d'espaces professionnels, elle offre une interface moderne et intuitive pour les utilisateurs et un tableau de bord complet pour les administrateurs.

### Points forts

- **Interface moderne** - Design responsive avec Tailwind CSS et shadcn/ui
- **Authentification robuste** - Clerk avec gestion des rôles
- **Paiement sécurisé** - Intégration complète Stripe avec webhooks et remboursements automatiques
- **Protection anti-abuse** - Système originalDate empêchant la manipulation des remboursements
- **Dashboard admin** - Statistiques en temps réel, gestion complète des salles et réservations
- **Emails transactionnels** - 6 types d'emails automatiques via Nodemailer
- **Docker ready** - Déploiement en une commande avec hot-reload
- **Performance optimisée** - Lazy loading, code splitting, React 19

---

## Installation rapide

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installé et démarré
- Compte [Clerk](https://clerk.com) (gratuit)
- Compte [Stripe](https://stripe.com) en mode test (gratuit)

### 3 étapes pour démarrer

```bash
# Cloner le projet
git clone https://github.com/Galateee/Bookly.git
cd "Bookly"

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés

cd ..

# Lancer l'application
docker compose up -d
```

**C'est prêt !**

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3001
- **Base de données** : localhost:5433

---

## Fonctionnalités

### Pour les utilisateurs

- **Inscription/Connexion** - Magic link via Clerk
- **Catalogue de salles** - Photos, équipements, capacité, tarifs en temps réel
- **Réservation interactive** - Calendrier avec créneaux disponibles et vérification conflits
- **Paiement sécurisé** - Stripe Checkout avec confirmation instantanée et webhooks
- **Notifications email** - Confirmation, modification, annulation, rappel J-1
- **Mes réservations** - Historique complet avec filtres et gestion
- **Modification** - Changement date/heure/participants avec recalcul automatique du prix
- **Annulation flexible** - Remboursement automatique selon politique (100%/50%/0%)
- **Protection** - Le système empêche la manipulation des dates pour obtenir de meilleurs remboursements
- **Profil & sécurité** - Gestion complète via Clerk (2FA, sessions, suppression compte)

### Pour les administrateurs

- **Dashboard** - Vue d'ensemble avec statistiques clés (revenus, réservations, utilisateurs)
- **Gestion des salles** - CRUD complet, activation/désactivation, protection suppression
- **Gestion des réservations** - Liste complète avec filtres avancés (status, salle, dates)
- **Modification admin** - Changement de n'importe quelle réservation sans restriction userId
- **Annulation admin** - Remboursement Stripe automatique + emails (client + admin)
- **Changement de statut** - Mise à jour manuelle des statuts de réservation
- **Notifications email** - Alerte sur nouvelles réservations et annulations
- **Utilisateurs actifs** - Suivi de l'activité en temps réel
- **Top salles** - Classement des salles les plus réservées avec statistiques
- **Revenus mensuels** - Suivi des paiements et remboursements

---

## Stack technique

### Frontend

- **React 19** - Framework UI moderne
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styling utility-first
- **shadcn/ui** - Composants UI élégants
- **React Router** - Navigation côté client
- **Clerk** - Authentification OAuth
- **Stripe.js** - Paiement sécurisé

### Backend

- **Node.js 20** - Runtime JavaScript
- **Express** - Framework web minimaliste
- **TypeScript** - Typage statique
- **Prisma** - ORM moderne pour PostgreSQL
- **PostgreSQL 15** - Base de données relationnelle
- **Stripe API** - Webhooks et paiements
- **Clerk SDK** - Vérification JWT
- **Nodemailer** - Service d'envoi d'emails (Gmail SMTP)

### DevOps

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-services
- **Nodemon** - Hot reload backend
- **Vite HMR** - Hot reload frontend

---

## Structure du projet

```
Bookly/
│
├── Bookly Front/              # Frontend React
│   ├── src/
│   │   ├── components/            # Composants réutilisables
│   │   │   ├── auth/              # Auth provider, routes protégées
│   │   │   ├── booking/           # Formulaires, cartes de réservation
│   │   │   ├── admin/             # Composants admin
│   │   │   └── ui/                # shadcn/ui components
│   │   ├── hooks/                 # Hooks personnalisés
│   │   ├── lib/                   # Utilitaires (validation, statuts)
│   │   ├── pages/                 # Pages et routes
│   │   ├── services/              # Services API
│   │   └── types/                 # Types TypeScript
│   └── .env.example
│
└── Bookly API/                # Backend Node.js
    ├── src/
    │   ├── controllers/           # Logique métier
    │   ├── middlewares/           # Auth, error handling
    │   ├── routes/                # Routes Express
    │   ├── services/              # Services externes (Stripe, Email)
    │   └── scripts/               # Scripts utilitaires (rappels J-1)
    ├── prisma/
    │   ├── schema.prisma          # Schéma de base de données
    │   ├── migrations/            # Migrations SQL
    │   └── seed.ts                # Données de test
    └── .env.example
```

---

## Configuration

### Variables d'environnement

`Bookly/.env`

```env
# -----------------------------------------------------------------------------
# PostgreSQL Database
# -----------------------------------------------------------------------------
POSTGRES_PASSWORD=changez_ce_mot_de_passe

DATABASE_URL=postgresql://bookly:changez_ce_mot_de_passe@postgres:5432/bookly

# -----------------------------------------------------------------------------
# Clerk Authentication (https://dashboard.clerk.com)
# -----------------------------------------------------------------------------

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# -----------------------------------------------------------------------------
# Stripe Payment (https://dashboard.stripe.com)
# -----------------------------------------------------------------------------

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MODE=test

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# -----------------------------------------------------------------------------
# Email Service https://myaccount.google.com/security
# -----------------------------------------------------------------------------

GMAIL_USER=votre.email@gmail.com
GMAIL_APP_PASSWORD=votre_mot_de_passe_app

EMAIL_FROM=Bookly <votre.email@gmail.com>
ADMIN_EMAIL=votre.email.admin@gmail.com
```

---

## Système d'emails

Bookly envoie **6 types d'emails automatiques** via Nodemailer + Gmail SMTP (gratuit, 500 emails/jour) :

### Pour les utilisateurs

1. **Confirmation de réservation** - Après paiement réussi
2. **Modification de réservation** - Lors de changements
3. **Annulation de réservation** - Confirmation d'annulation
4. **Rappel J-1** - 24h avant la réservation (via script cron)

### Pour les administrateurs

5. **Nouvelle réservation** - Notification de nouvelle réservation
6. **Annulation par utilisateur** - Notification d'annulation

### Configuration Gmail

1. Aller sur https://myaccount.google.com/security
2. Activer "2-Step Verification"
3. Créer un "App Password" (Mail)
4. Ajouter les variables dans `.env` :

```env
GMAIL_USER=votre.email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=Bookly <votre.email@gmail.com>
ADMIN_EMAIL=votre.email.admin@gmail.com
```

### Fonctionnalités

- ✅ **Templates HTML** professionnels avec styles inline
- ✅ **Retry automatique** - 3 tentatives avec backoff exponentiel
- ✅ **Non-bloquant** - L'envoi d'email n'empêche pas la réservation
- ✅ **Logs détaillés** - Suivi des succès/échecs
- ✅ **Script de rappels** - `npm run reminders` pour les notifications J-1

---

## Base de données

### Modèles principaux

**Room** - Salles de réunion

- Informations (nom, description, capacité)
- Tarification horaire
- Équipements
- Images
- Statut actif/inactif

**Booking** - Réservations

- 14 statuts différents (PENDING_PAYMENT, CONFIRMED, MODIFIED, CANCELLED_BY_USER, CANCELLED_BY_ADMIN, REFUNDED, etc.)
- Champ **originalDate** pour protection anti-abuse des remboursements
- Informations client complètes
- Dates et horaires avec validation conflits
- Prix total avec calcul automatique
- Liens Stripe (sessionId, paymentId, refundId)
- Relations avec paiements et remboursements

**Payment** - Paiements

- Montant et devise
- Statut Stripe
- Méthode de paiement
- Informations carte (4 derniers chiffres)

**Refund** - Remboursements

- Montant et pourcentage calculés automatiquement
- Raison (CANCELLED_BY_USER, CANCELLED_BY_ADMIN, etc.)
- Statut Stripe (PENDING, PROCESSING, SUCCEEDED, FAILED)
- Politique: 100% si ≥48h, 50% si 24-48h, 0% si <24h avant **date originale**
- Protection anti-abuse: calcul toujours basé sur originalDate

---

## Protection Anti-Abuse des Remboursements

### Problème identifié

Sans protection, un utilisateur malveillant pourrait :

1. Réserver une salle pour demain (remboursement 0%)
2. Modifier la date vers dans 3 mois (remboursement 100%)
3. Annuler immédiatement → obtenir 100% au lieu de 0%

### Solution implémentée

**Champ `originalDate`** dans la table Bookings:

- Stocke la date initiale de la réservation lors de la création
- Préservé lors des modifications (utilisateur ou admin)
- Le calcul de remboursement utilise **toujours** `originalDate` au lieu de `date`

### Résultat

✅ L'utilisateur peut modifier sa réservation autant de fois qu'il veut  
✅ Mais le remboursement sera toujours calculé sur la date **originale**  
❌ Impossible de manipuler le système pour obtenir un meilleur remboursement

---

## API Endpoints

### Public Routes

```
GET  /api/rooms              # Liste des salles actives
GET  /api/rooms/:id          # Détail d'une salle + disponibilités (7 jours)
GET  /health                 # Health check
```

### Protected Routes (Authentication Required)

```
POST   /api/bookings                    # Créer une réservation
GET    /api/bookings/my-bookings        # Mes réservations
GET    /api/bookings/:id                # Détail d'une réservation
PUT    /api/bookings/:id                # Modifier une réservation
DELETE /api/bookings/:id                # Annuler une réservation (avec remboursement)

POST   /api/payment/create-checkout     # Créer session Stripe
GET    /api/payment/verify/:sessionId   # Vérifier paiement
POST   /api/payment/refund              # Demander un remboursement
POST   /api/payment/calculate-refund    # Calculer montant remboursable
```

### Admin Routes (Role: admin Required)

```
# Salles
GET    /api/admin/rooms                 # Toutes les salles (actives + inactives)
POST   /api/admin/rooms                 # Créer une salle
PUT    /api/admin/rooms/:id             # Modifier une salle
PATCH  /api/admin/rooms/:id/toggle      # Activer/désactiver une salle
DELETE /api/admin/rooms/:id             # Supprimer une salle (si désactivée + 0 réservation)

# Réservations
GET    /api/admin/bookings              # Toutes les réservations (avec filtres)
PUT    /api/admin/bookings/:id          # Modifier n'importe quelle réservation (sans userId check)
PATCH  /api/admin/bookings/:id/status   # Changer le statut
DELETE /api/admin/bookings/:id          # Annuler avec remboursement automatique

# Statistiques
GET    /api/admin/statistics            # Dashboard stats (revenus, bookings, top rooms)
```

### Webhook Routes (Stripe Signature Verification)

```
POST /api/webhooks/stripe               # Webhook Stripe (checkout.completed, payment.failed, charge.refunded)
```

---

## Tests et développement

### Comptes de test

**Admin** : Ajouter `{"role": "admin"}` dans les métadonnées publiques Clerk

**Cartes de test Stripe** :

- ✅ Succès : `4242 4242 4242 4242`
- ❌ Décliné : `4000 0000 0000 0002`
- 🔐 3D Secure : `4000 0027 6000 3184`
- Date : N'importe quelle date future
- CVC : N'importe quel 3 chiffres

### Commandes utiles

```bash
# Voir les logs
docker compose logs -f              # Tous les services
docker compose logs -f api          # Backend uniquement
docker compose logs -f frontend     # Frontend uniquement

# Redémarrer
docker compose restart              # Tous les services
docker compose restart api          # Backend uniquement

# Arrêter
docker compose down                 # Arrêter les services
docker compose down -v              # Arrêter et supprimer les données

# Base de données
docker compose exec api npx prisma studio   # Interface graphique
docker compose exec api npx prisma db seed  # Données de test
docker compose exec api npx prisma migrate dev --name ma_migration

# Emails
docker compose exec api npm run reminders   # Envoyer les rappels J-1

# Reconstruire après modifications
docker compose up -d --build

# Forcer la régénération du client Prisma
docker compose exec api npx prisma generate
docker compose restart api
```

---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile ! ⭐**

Fait avec ❤️

</div>
