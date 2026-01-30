
# Cookie-Banner/Consent-Manager Implementierung

## Uebersicht

Ich werde einen DSGVO-konformen Cookie-Banner implementieren, der Besuchern die Moeglichkeit gibt, verschiedene Cookie-Kategorien zu akzeptieren oder abzulehnen. Der Banner wird beim ersten Besuch angezeigt und die Entscheidung wird persistent gespeichert.

## Funktionsumfang

### Cookie-Kategorien
- **Notwendig**: Immer aktiviert (Session, Auth) - kann nicht deaktiviert werden
- **Statistik**: Fuer zukuenftige Analytics-Integration (z.B. Google Analytics)
- **Marketing**: Fuer zukuenftige Marketing-Tools (z.B. Newsletter-Tracking)

### Benutzerinteraktion
- Einfache Buttons: "Alle akzeptieren", "Nur notwendige", "Einstellungen"
- Detaillierte Einstellungen mit Toggles pro Kategorie
- Jederzeit aenderbar ueber Link im Footer
- Animierter Einstieg von unten

## Architektur

```text
+----------------------------------+
|           App.tsx                |
+----------------------------------+
          |
          v
+----------------------------------+
|   CookieConsentProvider          |
|   (Context + State Management)   |
+----------------------------------+
          |
          v
+----------------------------------+
|      CookieBanner.tsx            |
|   (UI-Komponente mit Dialog)     |
+----------------------------------+
```

## Neue Dateien

### 1. `src/contexts/CookieConsentContext.tsx`
Ein React Context der den Consent-Status verwaltet:
- `consent`: Objekt mit `necessary`, `statistics`, `marketing` (boolean)
- `hasConsented`: Ob der Nutzer bereits eine Entscheidung getroffen hat
- `acceptAll()`: Alle Kategorien akzeptieren
- `acceptNecessary()`: Nur notwendige akzeptieren
- `updateConsent(category, value)`: Einzelne Kategorie aendern
- `resetConsent()`: Consent zuruecksetzen (Banner erneut zeigen)

Speicherung erfolgt in `localStorage` unter dem Key `cookie-consent`.

### 2. `src/components/CookieBanner.tsx`
Die sichtbare Komponente:
- Wird nur angezeigt wenn `hasConsented === false`
- Feste Position am unteren Bildschirmrand
- Responsive Design (Mobile/Desktop)
- Framer Motion Animation beim Ein-/Ausblenden
- "Einstellungen"-Button oeffnet einen Dialog mit detaillierten Optionen

## Anpassungen bestehender Dateien

### 3. `src/App.tsx`
- Import und Einbindung des `CookieConsentProvider`
- Einbindung der `CookieBanner` Komponente

### 4. `src/components/layout/Footer.tsx`
- Neuer Link "Cookie-Einstellungen" im Bereich "Rechtliches"
- Verwendet `resetConsent()` um den Banner erneut anzuzeigen

### 5. `src/pages/Datenschutz.tsx`
- Erweiterung des Cookie-Abschnitts mit mehr Details zu den Kategorien
- Button um Cookie-Einstellungen zu oeffnen

---

## Technische Details

### Consent-Datenstruktur
```typescript
interface CookieConsent {
  necessary: boolean;  // immer true
  statistics: boolean;
  marketing: boolean;
  timestamp: string;   // Zeitpunkt der Zustimmung
}
```

### LocalStorage Schema
```json
{
  "necessary": true,
  "statistics": false,
  "marketing": false,
  "timestamp": "2026-01-30T12:00:00.000Z"
}
```

### Verwendete Komponenten
- Bestehende UI-Komponenten: `Button`, `Dialog`, `Switch`, `Card`
- Framer Motion fuer Animationen
- Lucide Icons: `Cookie`, `Settings`, `Shield`, `BarChart3`, `Megaphone`

### Styling
- Konsistentes Design mit dem bestehenden Kulturrat-Theme
- Dunkler Hintergrund (tertiary) fuer Kontrast
- Gradient-Buttons fuer primaere Aktionen
- Glasmorphism-Effekt optional

### Accessibility
- Korrektes ARIA-Labeling
- Keyboard-Navigation
- Focus-Management beim Dialog
- Screen-Reader-freundliche Texte

