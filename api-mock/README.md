# API Mock Server - BookRoom

Serveur backend mock pour tester le frontend de l'application de réservation.

## Démarrage

Depuis la racine du projet (`booking-app/`) :

```bash
npm run api
```

Le serveur démarre sur `http://localhost:3001`

## Endpoints disponibles

### GET /api/rooms

Récupérer la liste des salles

**Paramètres query (optionnels) :**

- `capacity` : capacité minimale
- `equipments` : équipements requis

### GET /api/rooms/:id

Récupérer le détail d'une salle

### POST /api/bookings

Créer une réservation

**Body :**

```json
{
  "roomId": "room-001",
  "date": "2026-01-20",
  "startTime": "14:00",
  "endTime": "16:00",
  "customerName": "Jean Dupont",
  "customerEmail": "jean@example.com",
  "customerPhone": "+33612345678",
  "numberOfPeople": 8
}
```

### GET /api/bookings?email=xxx

Récupérer les réservations d'un utilisateur
