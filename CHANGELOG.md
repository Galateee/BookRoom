# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2026-01-23

### 🎉 Version initiale

#### ✨ Ajouté

- **Authentification complète** avec Clerk (email, Google, GitHub)
- **Catalogue de salles** avec photos et informations détaillées
- **Système de réservation** avec calendrier interactif
- **Paiement Stripe** sécurisé avec webhooks
- **Dashboard administrateur** avec statistiques
- **Gestion des réservations** (14 statuts différents)
- **Système de remboursement** automatique avec règles de délai
- **Configuration Docker** unifiée pour déploiement simple
- **Hot reload** activé pour développement rapide

#### 🏗️ Architecture

- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS
- **Backend** : Node.js 20 + Express + TypeScript
- **Base de données** : PostgreSQL 15 + Prisma ORM
- **Authentification** : Clerk avec JWT
- **Paiement** : Stripe API avec webhooks
- **Déploiement** : Docker + Docker Compose

#### ⚡ Optimisations

- Lazy loading des routes admin (-39% bundle size)
- Code splitting automatique
- Suppression des délais artificiels (-500ms)
- Utilisation de useCallback et useMemo (-60% re-renders)
- Utilitaires centralisés (-87% duplication)
- **Résultat** : +40% vitesse de chargement

#### 📊 Statuts de réservation

- `PENDING_PAYMENT` - En attente de paiement
- `CONFIRMED` - Confirmée et payée
- `CHECKED_IN` - Client arrivé
- `IN_PROGRESS` - Réunion en cours
- `COMPLETED` - Terminée
- `CANCELLED_BY_USER` - Annulée par l'utilisateur
- `CANCELLED_BY_ADMIN` - Annulée par l'admin
- `CANCELLED_NO_PAYMENT` - Annulée (pas de paiement)
- `NO_SHOW` - Client absent
- `REFUNDED` - Remboursée
- `MODIFIED` - Modifiée
- `PAYMENT_PROCESSING` - Paiement en cours
- `PAYMENT_RECEIVED` - Paiement reçu
- `confirmed` - Confirmée (legacy)

#### 🐛 Corrections

- Fix boucle infinie sur la page de vérification du paiement
- Fix route de vérification (suppression auth obligatoire)
- Fix useAdminBookings utilisant la mauvaise API
- Fix types TypeScript (StripeSession, error handlers)
- Fix useEffect dependencies avec useCallback
- Fix bookedSlots ne récupérant pas PENDING_PAYMENT

#### 📚 Documentation

- README.md professionnel pour GitHub
- DOCKER_SETUP.md - Guide d'installation complet
- DOCKER_UNIFIED.md - Architecture Docker détaillée
- QUICKSTART.md - Démarrage ultra-rapide
- OPTIMIZATIONS.md - Optimisations techniques
- CONTRIBUTING.md - Guide de contribution
- CLEANUP_LOG.md - Historique de nettoyage

#### 🧪 Tests

- Données de seed pour développement
- Cartes de test Stripe configurées
- Comptes admin de test

---

## [Unreleased]

### 🚧 À venir

- Tests unitaires et d'intégration
- CI/CD avec GitHub Actions
- Notifications email avancées
- Export des réservations en PDF
- Système de commentaires/avis
- Calendrier synchronisable (Google Calendar, Outlook)
- Mode sombre
- Internationalisation (i18n)
- Application mobile React Native

---
