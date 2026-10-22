# 🕵️‍♂️ Anleitung für den Cache-Owner: "Operation Schattentausch"
## Leitfaden zur Veröffentlichung & Pflege deiner beiden D4-Mystery-Caches
### Made by Versteckules

---

### 1. In 2 Klicks auf GitHub Pages veröffentlichen

1. **Repository auf GitHub anlegen:**
   * Erstelle ein neues, öffentliches Repository auf [GitHub.com](https://github.com), z.B. namens `Spion`.
   * Lade alle Dateien aus diesem Ordner in das Repository hoch:
     ```bash
     git init
     git add .
     git commit -m "Initial release Operation Schattentausch"
     git branch -M main
     git remote add origin https://github.com/<DEIN-USERNAME>/Spion.git
     git push -u origin main
     ```
2. **GitHub Pages aktivieren:**
   * Gehe in deinem GitHub-Repository auf **Settings** -> **Pages**.
   * Wähle unter **Branch**: `main` und Ordner `/ (root)`. Klicke auf **Save**.
   * Nach ca. 60 Sekunden ist deine Web-App live unter:  
     `https://<DEIN-USERNAME>.github.io/Spion/`

---

### 2. So testest du das Spiel bequem zu Hause am PC (OFFLINETEST)

Du musst nicht 130 Meter im Wald an der Grenze stehen, um jede Szene zu prüfen:
1. Öffne die Web-App im Browser (z.B. lokal oder auf GitHub Pages).
2. Klicke auf `MISSION WEST` oder `MISSION OST`.
3. Tippe in das Terminal-Eingabefeld das Wort:  
   **`OFFLINETEST`** (mit Enter bestätigen).
4. Am oberen Bildschirmrand erscheint die **Simulations-Leiste**:
   * Klicke auf `[ 🔘 P1: Start ]` -> Simuliert Standort am Parkplatz/Start.
   * Klicke auf `[ 🔘 P2: Vorstoß ]` -> Simuliert Vorrücken zur Wegbiegung.
   * Klicke auf `[ 💥 P3: Schuss ]` -> Löst sofort den Schusswechsel, die Sirenen und den Anruf aus!
   * Klicke auf `[ ↩️ P4: Rückzug ]` -> Bringt dich zur Deckungsmulde für Triage, Radio und KGB-Kanal.
   * Klicke auf `[ 📍 P5: Final ]` -> Führt dich zur Demarkationslinie und zur Entschlüsselung.

---

### 3. Echte Dosen verstecken & Koordinaten verschlüsseln

Die Zwischenstationen sind 100% virtuell. Für das Finale versteckst du:
* **Dose West:** Im Umkreis von Münchenreuth (Bayern), z.B. unter einer alten Baumwurzel.
* **Dose Ost:** Im Umkreis von Gutenfürst (Sachsen), z.B. an einem alten Grenzstein.

#### So änderst du die verschlüsselten Koordinaten in `js/config.js`:
1. Öffne ein Terminal im Projektordner.
2. Führe das Verschlüsselungsskript aus:
   ```bash
   python scripts/encrypt_coords.py
   ```
3. Kopiere die ausgegebenen Strings für `iv` und `data` in die Datei [js/config.js](file:///c:/Users/flaem/Desktop/Antigravity/Spion/js/config.js).
4. Fertig! Niemand kann deine Dosen-Koordinaten im Quelltext oder per F12 spicken.

---

### 4. Einreichen bei Geocaching.com (Reviewer-Tipps)

1. **Zwei Listings anlegen (Typ: Mystery Cache):**
   * Listing 1: "Aktion Bayern-Adler" (Koordinaten: Bayern, Münchenreuth).
   * Listing 2: "Aktion Sachsen-Vogt" (Koordinaten: Sachsen, Gutenfürst).
2. **Listingtext einfügen:**
   * Kopiere den Inhalt aus [docs/LISTING_BAYERN.html](file:///c:/Users/flaem/Desktop/Antigravity/Spion/docs/LISTING_BAYERN.html) bzw. [docs/LISTING_SACHSEN.html](file:///c:/Users/flaem/Desktop/Antigravity/Spion/docs/LISTING_SACHSEN.html) in das HTML-Beschreibungsfeld auf Geocaching.com.
   * Ersetze `<DEIN-GITHUB-USERNAME>` durch deinen echten GitHub-Namen.
3. **Reviewer-Note:**
   * Schreibe dem Reviewer kurz:
     > *"Hallo Reviewer! Dies ist ein Wherigo/Web-Companion Mystery-Cache (D4.0 / T2.0). Alle Zwischenstationen sind rein virtuell auf dem befestigten Grenzweg. Das Final ist eine physikalische Dose. Die Web-App ist Open Source, werbefrei auf GitHub Pages gehostet und benötigt keinen App-Download. Für den Reviewer-Test am PC einfach das Codewort 'OFFLINETEST' im Terminal eingeben!"*
