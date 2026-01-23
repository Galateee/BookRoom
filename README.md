<div align="center">

# BookRoom

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

**BookRoom** est une application full-stack de gestion et réservation de salles de réunion avec système de paiement intégré. Conçue pour simplifier la réservation d'espaces professionnels, elle offre une interface moderne et intuitive pour les utilisateurs et un tableau de bord complet pour les administrateurs.

### Points forts

- **Interface moderne** - Design responsive avec Tailwind CSS et shadcn/ui
- **Authentification robuste** - Clerk
- **Paiement sécurisé** - Intégration complète Stripe avec webhooks
- **Dashboard admin** - Statistiques, gestion des salles et réservations
- **Docker ready** - Déploiement en une commande
- **Performance optimisée** - Lazy loading, code splitting

---

## Installation rapide

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installé et démarré
- Compte [Clerk](https://clerk.com) (gratuit)
- Compte [Stripe](https://stripe.com) en mode test (gratuit)

### 3 étapes pour démarrer

```bash
# Cloner le projet
git clone https://github.com/Galateee/BookRoom.git
cd "BookRoom"

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

- **Inscription/Connexion** - Email, via Clerk
- **Catalogue de salles** - Photos, équipements, capacité, tarifs
- **Réservation interactive** - Calendrier avec créneaux disponibles
- **Paiement sécurisé** - Stripe Checkout avec confirmation par email
- **Mes réservations** - Historique et gestion
- **Annulation** - Remboursement automatique selon les conditions

### Pour les administrateurs

- **Dashboard** - Vue d'ensemble avec statistiques clés
- **Gestion des salles** - Créer, modifier, activer/désactiver
- **Toutes les réservations** - Filtres et changement de statut
- **Utilisateurs actifs** - Suivi de l'activité
- **Top salles** - Salles les plus réservées
- **Revenus** - Suivi des paiements

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

### DevOps

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-services
- **Nodemon** - Hot reload backend
- **Vite HMR** - Hot reload frontend

---

## Structure du projet

```
BookRoom/
│
├── BookRoom Front/              # Frontend React
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
└── BookRoom API/                # Backend Node.js
    ├── src/
    │   ├── controllers/           # Logique métier
    │   ├── middlewares/           # Auth, error handling
    │   ├── routes/                # Routes Express
    │   └── services/              # Services externes (Stripe)
    ├── prisma/
    │   ├── schema.prisma          # Schéma de base de données
    │   ├── migrations/            # Migrations SQL
    │   └── seed.ts                # Données de test
    └── .env.example
```

---

## 🔧 Configuration

### Variables d'environnement

`BookRoom/.env`

```env
# -----------------------------------------------------------------------------
# PostgreSQL Database
# -----------------------------------------------------------------------------
POSTGRES_PASSWORD=changez_ce_mot_de_passe

DATABASE_URL=postgresql://bookroom:changez_ce_mot_de_passe@postgres:5432/bookroom

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
```

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

- 14 statuts différents (PENDING_PAYMENT, CONFIRMED, etc.)
- Informations client
- Dates et horaires
- Prix total
- Liens avec paiements et remboursements

**Payment** - Paiements

- Montant et devise
- Statut Stripe
- Méthode de paiement
- Informations carte (4 derniers chiffres)

**Refund** - Remboursements

- Montant et pourcentage
- Raison
- Statut Stripe

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

# Reconstruire après modifications
docker compose up -d --build
```

---

## Optimisations

Le projet a été optimisé pour les performances :

- ✅ **-500ms** délais artificiels supprimés
- ✅ **-39%** taille du bundle (lazy loading)
- ✅ **-87%** code dupliqué (utilitaires)
- ✅ **-60%** re-renders inutiles (useCallback/useMemo)
- ✅ **+40%** vitesse de chargement

---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile ! ⭐**

Fait avec ❤️

</div>
