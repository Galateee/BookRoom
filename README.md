# BookRoom - Application de Réservation de Salles

Application frontend React + TypeScript pour la réservation de salles de réunion, développée selon les principes de conception avant codage.

## 📋 Documentation

- **[CONCEPTION.md](../CONCEPTION.md)** : Document complet de conception (périmètre, contrat API, états, architecture)

## 🚀 Installation

```bash
npm install
```

## 🏃 Démarrage

### 1. Démarrer le serveur backend mock

```bash
npm run api
```

Le serveur démarre sur `http://localhost:3001`

### 2. Démarrer le frontend

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`

## 🏗️ Structure du projet

```
booking-app/
├── src/
│   ├── components/
│   │   ├── common/          # Composants réutilisables
│   │   ├── layout/          # Layout et navigation
│   │   └── booking/         # Composants spécifiques
│   ├── pages/               # Pages de l'application
│   ├── hooks/               # Hooks personnalisés
│   ├── services/            # Service API
│   ├── types/               # Types TypeScript
│   └── App.tsx              # Configuration des routes
└── api-mock/                # Serveur backend mock
```

## 📱 Fonctionnalités

- ✅ Consultation de la liste des salles
- ✅ Consultation du détail d'une salle
- ✅ Création d'une réservation
- ✅ Consultation de ses réservations
- ✅ Gestion complète des états (chargement, succès, erreur, vide)
- ✅ Validation des formulaires
- ✅ Interface responsive

## 🔧 Technologies

- **React 18** + **TypeScript**
- **React Router v6** pour la navigation
- **Vite** comme build tool
- **CSS** pour le styling
- **Fetch API** pour les requêtes HTTP
- **Prettier** pour le formatage du code

## 📦 Livrables

- ✅ Périmètre fonctionnel ([CONCEPTION.md](doc/CONCEPTION.md) - Étape 1)
- ✅ Contrat API écrit ([CONCEPTION.md](doc/CONCEPTION.md) - Étape 2)
- ✅ Liste des états par écran ([CONCEPTION.md](doc/CONCEPTION.md) - Étape 3)
- ✅ Schéma d'architecture frontend ([CONCEPTION.md](doc/CONCEPTION.md) - Étape 4)
- ✅ Frontend implémenté (ce dossier)
