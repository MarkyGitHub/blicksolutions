# Einkaufsliste – Full Stack (React + TS + Express + MongoDB)

Eine kleine Full-Stack-Anwendung, mit der man Produkte zur Einkaufsliste hinzufügen, als „gekauft“ markieren und wieder löschen kann.

## Tech-Stack

- **Frontend:** React + TypeScript (Vite)
- **UI:** Material UI (MUI)
- **Backend:** Express + TypeScript
- **DB:** MongoDB + Mongoose

## Voraussetzungen

- Node.js (aktuelle LTS empfohlen)
- MongoDB lokal **oder** MongoDB Atlas

## Setup

### 1) Backend konfigurieren

1. In den Backend-Ordner wechseln:

   ```bash
   cd backend
   ```

2. Env-Datei anlegen:

   - `backend/.env`
   - Passe mindestens `MONGO_URI` an

   Wenn MongoDB lokal (oder per Docker Port-Mapping `27017:27017`) auf `127.0.0.1:27017` läuft, verwende z. B.:

   ```
   MONGO_URI=mongodb://127.0.0.1:27017/shopping_list
   ```

3. Dependencies installieren und Backend starten:

   ```bash
   npm install
   npm run dev
   ```

Backend läuft standardmäßig auf `http://localhost:4000`.

### 2) Frontend konfigurieren

1. In den Frontend-Ordner wechseln:

   ```bash
   cd frontend
   ```

2. Env-Datei anlegen:

   - `frontend/.env`
   - `VITE_API_URL` sollte auf das Backend zeigen (z. B. `http://localhost:4000`)

3. Dependencies installieren und Frontend starten:

   ```bash
   npm install
   npm run dev
   ```

Frontend läuft standardmäßig auf `http://localhost:5173`.

## API (Backend)

- `GET /items` – gibt alle Einträge zurück
- `POST /items` – erstellt neuen Eintrag, Body: `{ "name": string }`
- `PUT /items/:id` – setzt gekauft-Status, Body: `{ "bought": boolean }`
- `DELETE /items/:id` – löscht Eintrag

## Datenmodell

Ein Eintrag hat folgende Felder:

- `_id`: ObjectId
- `name`: string
- `bought`: boolean
- `createdAt`: Date

## Hinweise

- Zustand im Frontend ist client-seitig via `useState`/`useEffect`.
- CORS ist im Backend aktiviert; optional kann `FRONTEND_ORIGIN` gesetzt werden.
