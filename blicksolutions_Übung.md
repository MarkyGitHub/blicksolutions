# Aufgabe:

Erstelle eine einfache Full Stack Anwendung (React + TypeScript + Express + MongoDB / Mongoose), mit der Benutzer Produkte zur Einkaufsliste hinzufügen, abhaken und löschen können.

## **Funktionale Anforderungen**

### **Frontend (React + TypeScript)**

- **Input-Feld + Button** zum Hinzufügen eines Eintrags:
    - Produktname (z. B. „Butter")
- **Liste der Einträge** mit:
    - Produktname
    - Checkbox „gekauft" (✓) (der Eintrag wird durchgestrichen nach dem abhaken)
    - „Löschen"-Button
	
### **Anforderungen an die UI**

- Du kannst gerne ein externes UI-Toolkit verwenden
- Die Oberfläche sollte **einfach, aber ansprechend gestaltet** sein
- Es gibt **keine festen Vorgaben fürs Layout** – du darfst kreativ sein 😊

### **Backend (Express + TypeScript)**

#### Endpunkte

- `GET /items`
    
    ➜ Gibt die Einkaufsliste zurück
    
- `POST /items`
    
    ➜ Fügt einen neuen Eintrag hinzu
    
    **Body:** `{ name: string }`
    
- `PUT /items/:id`
    
    ➜ Aktualisiert den „gekauft"-Status
    
    **Body:** `{ bought: boolean }`
    
- `DELETE /items/:id`
    
    ➜ Löscht einen Eintrag
	
#### **MongoDB-Datenmodell**

```typescript
interface ShoppingItem {
	_id: ObjectId;
	name: string;
	bought: boolean;
	createdAt: Date;
}
```

## **Technische Anforderungen**

- **React mit TypeScript** im Frontend
- **Express mit TypeScript** im Backend
- **MongoDB** als Datenbank (lokal oder über MongoDB Atlas)
- Zustand im Frontend: client-seitig (z. B. via useState/useEffect)
- Keine Authentifizierung notwendig!

## **Abgabe**

- GitHub-Repo mit `README.md`:
    - Setup-Anleitung
    - Hinweis, ob externe UI-Bibliotheken verwendet wurden
- Strukturierter Code (Frontend und Backend getrennt)

## **Bewertungskriterien**

- Funktionalität der Anwendung
- Sauberer TypeScript-Code
    - Typsicherheit im Frontend und Backend
- Nutzung von React-Patterns & Zustand
- Lesbarkeit & Struktur des Codes
- UI-Qualität (Design, Benutzerfreundlichkeit, Responsiveness)
