# TP FRONTEND - CONCEPTION APPLICATION DE RÉSERVATION

## ÉTAPE 1 - PÉRIMÈTRE FONCTIONNEL

### Type d'élément réservable

**Salles de réunion** dans un espace de coworking

### Public cible

**Professionnels et entreprises** ayant besoin d'espaces de réunion ponctuels

### Parcours utilisateur principal

**Un utilisateur doit pouvoir :**

1. Consulter la liste des salles de réunion disponibles avec leurs caractéristiques (capacité, équipements, prix)
2. Consulter le détail d'une salle (photos, équipements complets, disponibilités)
3. Réserver une salle pour une date et un créneau horaire spécifique
4. Recevoir une confirmation claire de sa réservation
5. Consulter ses réservations en cours

---

## ÉTAPE 2 - CONTRAT API FRONTEND / BACKEND

### Action 1 : Récupérer la liste des salles

**Endpoint :** `GET /api/rooms`

**Intention fonctionnelle :**
Obtenir la liste de toutes les salles disponibles à la réservation avec leurs caractéristiques principales.

**Réponses possibles :**

**Succès 200 - avec données :**

```json
{
  "success": true,
  "data": [
    {
      "id": "room-001",
      "name": "Salle Innovation",
      "capacity": 10,
      "pricePerHour": 50,
      "equipments": ["projector", "whiteboard", "wifi"],
      "imageUrl": "/images/room-001.jpg"
    }
  ],
  "meta": {
    "total": 15
  }
}
```

**Succès 200 - liste vide :**

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0
  }
}
```

**Erreur 500 - erreur technique :**

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Une erreur technique est survenue"
  }
}
```

---

### Action 2 : Récupérer le détail d'une salle

**Endpoint :** `GET /api/rooms/:id`

**Intention fonctionnelle :**
Obtenir toutes les informations détaillées d'une salle spécifique, incluant ses disponibilités.

**Paramètres :**

- `id` (string, path parameter) : identifiant unique de la salle

**Réponses possibles :**

**Succès 200 - salle trouvée :**

```json
{
  "success": true,
  "data": {
    "id": "room-001",
    "name": "Salle Innovation",
    "description": "Salle moderne équipée pour les réunions créatives",
    "capacity": 10,
    "pricePerHour": 50,
    "equipments": ["projector", "whiteboard", "wifi", "video-conference"],
    "images": ["/images/room-001-1.jpg", "/images/room-001-2.jpg"],
    "availableSlots": [
      {
        "date": "2026-01-20",
        "slots": ["09:00", "10:00", "14:00", "15:00", "16:00"]
      }
    ]
  }
}
```

**Erreur 404 - salle inexistante :**

```json
{
  "success": false,
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "La salle demandée n'existe pas"
  }
}
```

**Erreur 500 - erreur serveur :**

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Une erreur technique est survenue"
  }
}
```

---

### Action 3 : Créer une réservation

**Endpoint :** `POST /api/bookings`

**Intention fonctionnelle :**
Créer une nouvelle réservation pour une salle à une date et un créneau horaire donnés.

**Données envoyées (body) :**

```json
{
  "roomId": "room-001",
  "date": "2026-01-20",
  "startTime": "14:00",
  "endTime": "16:00",
  "customerName": "Jean Dupont",
  "customerEmail": "jean.dupont@example.com",
  "customerPhone": "+33612345678",
  "numberOfPeople": 8
}
```

**Validation requise :**

- `roomId` : obligatoire, doit exister
- `date` : obligatoire, format ISO 8601, ne peut pas être dans le passé
- `startTime` & `endTime` : obligatoires, format HH:mm, endTime > startTime
- `customerName` : obligatoire, min 2 caractères
- `customerEmail` : obligatoire, format email valide
- `customerPhone` : obligatoire, format téléphone
- `numberOfPeople` : obligatoire, doit être <= capacity de la salle

**Réponses possibles :**

**Succès 201 - réservation créée :**

```json
{
  "success": true,
  "data": {
    "bookingId": "booking-12345",
    "roomId": "room-001",
    "roomName": "Salle Innovation",
    "date": "2026-01-20",
    "startTime": "14:00",
    "endTime": "16:00",
    "customerName": "Jean Dupont",
    "customerEmail": "jean.dupont@example.com",
    "totalPrice": 100,
    "status": "confirmed",
    "createdAt": "2026-01-19T10:30:00Z"
  },
  "message": "Réservation confirmée avec succès"
}
```

**Erreur 400 - données invalides :**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données de réservation invalides",
    "details": {
      "customerEmail": "Format d'email invalide",
      "numberOfPeople": "Le nombre de personnes dépasse la capacité de la salle"
    }
  }
}
```

**Erreur 409 - créneau non disponible :**

```json
{
  "success": false,
  "error": {
    "code": "SLOT_NOT_AVAILABLE",
    "message": "Ce créneau horaire n'est plus disponible"
  }
}
```

**Erreur 404 - salle inexistante :**

```json
{
  "success": false,
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "La salle sélectionnée n'existe pas"
  }
}
```

**Erreur 500 - erreur serveur :**

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Une erreur technique est survenue lors de la réservation"
  }
}
```

---

### Action 4 : Récupérer les réservations d'un utilisateur

**Endpoint :** `GET /api/bookings`

**Intention fonctionnelle :**
Obtenir la liste des réservations effectuées par un utilisateur.

**Paramètres (query string) :**

- `email` (string, obligatoire) : email de l'utilisateur

**Réponses possibles :**

**Succès 200 - avec réservations :**

```json
{
  "success": true,
  "data": [
    {
      "bookingId": "booking-12345",
      "roomName": "Salle Innovation",
      "date": "2026-01-20",
      "startTime": "14:00",
      "endTime": "16:00",
      "status": "confirmed",
      "totalPrice": 100
    }
  ],
  "meta": {
    "total": 3
  }
}
```

**Succès 200 - aucune réservation :**

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0
  }
}
```

**Erreur 400 - email manquant :**

```json
{
  "success": false,
  "error": {
    "code": "MISSING_EMAIL",
    "message": "L'email est requis pour consulter les réservations"
  }
}
```

**Erreur 500 - erreur serveur :**

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Une erreur technique est survenue"
  }
}
```

---

## ÉTAPE 3 - ÉTATS DE L'INTERFACE

### Page : Liste des salles (`/rooms`)

#### État 1 : Initial / Chargement

- **Quand :** Au chargement de la page, avant que les données arrivent
- **Ce que voit l'utilisateur :**
  - Titre "Nos salles de réunion" visible
  - Skeleton loader (cartes fantômes animées) à la place des salles
  - Message : "Chargement des salles disponibles..."

#### État 2 : Succès avec données

- **Quand :** Les salles sont récupérées avec succès (au moins une salle)
- **Ce que voit l'utilisateur :**
  - Grille de cartes affichant les salles
  - Chaque carte montre : nom, capacité, prix, image, équipements principaux
  - Compteur : "15 salles disponibles"
  - Bouton "Voir les détails" sur chaque carte

#### État 3 : Succès avec liste vide (aucune donnée)

- **Quand :** Aucune salle n'est disponible
- **Ce que voit l'utilisateur :**
  - Icône illustrative (loupe ou calendrier barré)
  - Message principal : "Aucune salle disponible"
  - Message secondaire : "Aucune salle n'est disponible pour le moment"
  - Bouton "Réessayer"

#### État 4 : Erreur technique

- **Quand :** La requête échoue (erreur 500, timeout, pas de réseau)
- **Ce que voit l'utilisateur :**
  - Icône d'alerte
  - Message principal : "Impossible de charger les salles"
  - Message secondaire : "Une erreur technique s'est produite"
  - Bouton "Réessayer" bien visible

---

### Page : Détail d'une salle (`/rooms/:id`)

#### État 1 : Chargement

- **Quand :** Lors de l'accès à la page de détail
- **Ce que voit l'utilisateur :**
  - Skeleton loader pour l'image principale
  - Skeleton loader pour le titre et la description
  - Skeleton loader pour les créneaux disponibles
  - Message : "Chargement des informations..."

#### État 2 : Succès - salle trouvée

- **Quand :** Les détails de la salle sont récupérés avec succès
- **Ce que voit l'utilisateur :**
  - Galerie d'images de la salle (navigable)
  - Nom, description complète
  - Caractéristiques détaillées (capacité, équipements, prix)
  - Calendrier/sélecteur de créneaux disponibles
  - Formulaire de réservation visible et actif
  - Bouton "Réserver" actif (si un créneau est sélectionné)

#### État 3 : Erreur - salle inexistante (404)

- **Quand :** La salle demandée n'existe pas ou l'ID est invalide
- **Ce que voit l'utilisateur :**
  - Icône d'erreur
  - Message principal : "Salle introuvable"
  - Message secondaire : "Cette salle n'existe pas ou n'est plus disponible"
  - Bouton "Retour à la liste des salles"

#### État 4 : Erreur technique

- **Quand :** Erreur serveur lors de la récupération des détails
- **Ce que voit l'utilisateur :**
  - Icône d'alerte
  - Message principal : "Impossible de charger les détails de la salle"
  - Message secondaire : "Une erreur technique s'est produite"
  - Bouton "Réessayer"
  - Bouton secondaire "Retour à la liste"

---

### Composant : Formulaire de réservation

#### État 1 : Initial (avant saisie)

- **Quand :** Le formulaire vient d'être affiché
- **Ce que voit l'utilisateur :**
  - Tous les champs vides et actifs
  - Créneau pré-sélectionné si venu depuis un clic sur créneau
  - Bouton "Réserver" désactivé (grisé)
  - Aucun message d'erreur

#### État 2 : Saisie en cours avec validation

- **Quand :** L'utilisateur remplit le formulaire
- **Ce que voit l'utilisateur :**
  - Validation en temps réel sous chaque champ
  - Messages d'erreur spécifiques en rouge si invalide :
    - "Email invalide"
    - "Le nom doit contenir au moins 2 caractères"
    - "Le nombre de personnes dépasse la capacité (max: 10)"
  - Indicateurs visuels (bordure rouge/verte)
  - Bouton "Réserver" reste désactivé tant que le formulaire n'est pas valide

#### État 3 : Formulaire valide (prêt à envoyer)

- **Quand :** Tous les champs sont correctement remplis
- **Ce que voit l'utilisateur :**
  - Tous les champs avec bordure verte ou neutre
  - Aucun message d'erreur
  - Bouton "Réserver" actif et cliquable (couleur principale)
  - Récapitulatif visible : prix total calculé

#### État 4 : Envoi en cours

- **Quand :** L'utilisateur a cliqué sur "Réserver" et la requête est en cours
- **Ce que voit l'utilisateur :**
  - Tous les champs désactivés (opacité réduite)
  - Bouton "Réserver" désactivé avec spinner
  - Texte du bouton : "Réservation en cours..."
  - Impossible de modifier les champs

#### État 5 : Succès de la réservation

- **Quand :** La réservation est confirmée par le backend (201)
- **Ce que voit l'utilisateur :**
  - Modal ou bannière de succès avec icône ✓
  - Message principal : "Réservation confirmée !"
  - Récapitulatif complet de la réservation (numéro, salle, date, heure, prix)
  - Message secondaire : "Un email de confirmation a été envoyé à [email]"
  - Bouton "Voir mes réservations"
  - Bouton "Retour à l'accueil"
  - Le formulaire n'est plus visible ou est réinitialisé

#### État 6 : Erreur - Créneau non disponible (409)

- **Quand :** Le créneau a été réservé entre-temps
- **Ce que voit l'utilisateur :**
  - Bannière d'erreur avec icône ⚠️
  - Message principal : "Ce créneau n'est plus disponible"
  - Message secondaire : "Quelqu'un vient de réserver ce créneau. Veuillez en choisir un autre."
  - Le formulaire reste rempli
  - Le sélecteur de créneaux se rafraîchit automatiquement
  - Bouton "Choisir un autre créneau"

#### État 7 : Erreur - Validation (400)

- **Quand :** Les données sont rejetées par le backend
- **Ce que voit l'utilisateur :**
  - Messages d'erreur spécifiques sous les champs concernés
  - Bannière d'erreur : "Veuillez corriger les erreurs"
  - Les champs en erreur sont mis en évidence (bordure rouge)
  - Le formulaire reste actif et modifiable
  - Bouton "Réserver" redevient actif après correction

#### État 8 : Erreur technique (500)

- **Quand :** Erreur serveur ou réseau lors de la réservation
- **Ce que voit l'utilisateur :**
  - Bannière d'erreur avec icône ❌
  - Message principal : "Impossible de finaliser la réservation"
  - Message secondaire : "Une erreur technique s'est produite. Vos données ont été préservées."
  - Le formulaire reste rempli avec les données
  - Bouton "Réessayer" visible et actif
  - Bouton secondaire "Annuler"

---

### Page : Mes réservations (`/my-bookings`)

#### État 1 : Initial (avant saisie email)

- **Quand :** L'utilisateur arrive sur la page
- **Ce que voit l'utilisateur :**
  - Titre : "Mes réservations"
  - Champ de saisie d'email vide
  - Message : "Entrez votre email pour consulter vos réservations"
  - Bouton "Consulter" désactivé

#### État 2 : Chargement des réservations

- **Quand :** Après avoir saisi l'email et cliqué sur "Consulter"
- **Ce que voit l'utilisateur :**
  - Skeleton loader (cartes fantômes)
  - Message : "Chargement de vos réservations..."
  - Champ email désactivé temporairement

#### État 3 : Succès avec réservations

- **Quand :** L'utilisateur a des réservations
- **Ce que voit l'utilisateur :**
  - Liste des réservations sous forme de cartes
  - Chaque carte affiche : salle, date, horaires, prix, statut
  - Badge de statut visible (confirmé, passé, annulé)
  - Tri par date (prochaines en premier)
  - Compteur : "Vous avez 3 réservation(s)"

#### État 4 : Succès sans réservation

- **Quand :** Aucune réservation pour cet email
- **Ce que voit l'utilisateur :**
  - Icône illustrative (calendrier vide)
  - Message : "Vous n'avez pas encore de réservation"
  - Bouton "Découvrir nos salles"

#### État 5 : Erreur - Email manquant

- **Quand :** Tentative de consultation sans email
- **Ce que voit l'utilisateur :**
  - Message d'erreur sous le champ : "L'email est requis"
  - Bordure rouge sur le champ
  - Bouton "Consulter" reste désactivé

#### État 6 : Erreur technique

- **Quand :** Erreur lors de la récupération
- **Ce que voit l'utilisateur :**
  - Bannière d'erreur
  - Message : "Impossible de récupérer vos réservations"
  - Bouton "Réessayer"
  - Le champ email reste rempli

---

## ÉTAPE 4 - ARCHITECTURE FRONTEND

### Structure des pages / vues

```
/                           → Page d'accueil (redirection vers /rooms)
/rooms                      → Liste des salles
/rooms/:id                  → Détail d'une salle + formulaire de réservation
/my-bookings                → Mes réservations
```

### Composants principaux

#### Composants de layout

- `Header` : Navigation principale
- `Footer` : Informations de bas de page
- `Layout` : Wrapper général

#### Composants de page

- `RoomList` : Affiche la liste des salles
- `RoomDetail` : Affiche le détail d'une salle
- `MyBookings` : Affiche les réservations de l'utilisateur

#### Composants réutilisables

- `RoomCard` : Carte d'une salle (utilisé dans la liste)
- `BookingForm` : Formulaire de réservation
- `SlotPicker` : Sélecteur de créneaux horaires
- `BookingCard` : Carte d'une réservation
- `LoadingSpinner` : Indicateur de chargement
- `ErrorMessage` : Affichage des erreurs
- `EmptyState` : État vide (pas de données)
- `Button` : Bouton réutilisable
- `Input` : Champ de saisie

### Gestion des états

**Solution retenue : Context API + Hooks personnalisés**

#### Hooks personnalisés

- `useRooms()` : Gestion de la liste des salles
- `useRoom(id)` : Gestion du détail d'une salle
- `useBooking()` : Gestion de la création de réservation
- `useMyBookings(email)` : Gestion des réservations d'un utilisateur

#### Structure d'un état type

```javascript
{
  data: null | Object | Array,
  loading: boolean,
  error: null | { code: string, message: string },
  success: boolean
}
```

### Communication avec l'API

**Service API centralisé : `api.service.js`**

#### Structure

```javascript
// api.service.js
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:3001/api' -
    // Méthodes
    getRooms() -
    getRoomById(id) -
    createBooking(bookingData) -
    getBookingsByEmail(email);
```

#### Gestion des erreurs centralisée

- Intercepteur pour les erreurs réseau
- Mapping des codes d'erreur backend vers messages utilisateur
- Retry automatique en cas d'échec temporaire (optionnel)

### Technologies proposées

**Framework :** React 18+
**Routing :** React Router v6
**Styling :** CSS Modules ou Styled Components
**État global :** Context API (ou Zustand pour simplifier)
**HTTP Client :** Fetch API (natif) ou Axios
**Validation :** Validation manuelle ou Zod
**Build :** Vite

### Arborescence des fichiers

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── EmptyState.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   └── booking/
│       ├── RoomCard.jsx
│       ├── BookingForm.jsx
│       ├── SlotPicker.jsx
│       └── BookingCard.jsx
├── pages/
│   ├── RoomList.jsx
│   ├── RoomDetail.jsx
│   └── MyBookings.jsx
├── hooks/
│   ├── useRooms.js
│   ├── useRoom.js
│   ├── useBooking.js
│   └── useMyBookings.js
├── services/
│   └── api.service.js
├── utils/
│   ├── validators.js
│   └── formatters.js
├── App.jsx
└── main.jsx
```

---

## RÉCAPITULATIF DE LA CONCEPTION

### Points clés validés

✅ **Périmètre clair** : Réservation de salles de réunion pour professionnels
✅ **Contrat API complet** : 4 endpoints documentés avec tous les cas
✅ **États exhaustifs** : Chaque écran a tous ses états définis
✅ **Architecture pensée** : Composants, hooks, services organisés
✅ **Gestion d'erreur** : Chaque erreur possible a un affichage prévu

### Prêt pour l'implémentation

La phase de conception est terminée. Nous pouvons maintenant passer à l'implémentation du frontend en respectant ce qui a été défini.
