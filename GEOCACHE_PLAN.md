# 🕵️‍♂️ DUAL-GEOCACHE: "OPERATION SCHATTENTAUSCH – DER ZWISCHENFALL"
## Der ultimative Spionage-Thriller an der Grenze Bayern / Sachsen (1983)
### 2 Mystery-Caches • Made by Versteckules • Hybrid OpenStreetMap & Vektorkarte • 7 Polaroid-Porträts • Kompass (±10m) • Replay & `OFFLINETEST`

---

### 1. Die Eingangsseite (Cover Screen) – "Weniger ist mehr"

Beim ersten Öffnen der Web-App empfängt den Spieler ein hochästhetischer, minimalistischer Startbildschirm ohne ermüdende Textwüsten:
* **Titel:** `OPERATION SCHATTENTAUSCH`
* **Untertitel:** `GEFANGENENAUSTAUSCH AM GRENZGRABEN (BAYERN / SACHSEN 1983)`
* **Missionshintergrund diskret:**
  * Statt den Bildschirm mit langen Textabsätzen zu überladen, steht ein dezenter Button zur Verfügung:  
    `[ 📜 STORY & HINTERGRUND ANZEIGEN ]` öffnet ein kompaktes, stilvolles Modal für Story-Liebhaber.
* **Owner-Branding:**
  * Schräg aufgeklebter Dienstausweis mit `avatar.jpg` (ca. -3° rotiert, Büroklammer, Schattenwurf).
  * Schriftzug: **`Made by Versteckules`**
  * *Owner-Geheimfunktion:* Ein schneller Dreifachklick auf das Avatarbild schaltet die Test- und Simulationsleiste frei.
* **Agenten-Registrierung (Schnell & intuitiv):**
  * Prominentes Eingabefeld: `Codename / Agentenname (z.B. Adler-7, Sperber, Versteckules)`.
  * Verhindert unpersönliche Sessions; Name wird dauerhaft gespeichert und im gesamten HUD angezeigt.
  * Erst nach Eingabe eines Namens werden die beiden Einsatzseiten freigeschaltet.
* **Fraktions-Auswahl (2 kontrastreiche Tasten):**
  * `[ 🦁 MISSION WEST (Bayern / BND) ]` – Start bei Münchenreuth (`50.330406, 12.069081`)
  * `[ ⚒️ MISSION OST (Sachsen / MfS) ]` – Start bei Gutenfürst (`50.331520, 12.069700`)
* **Owner-Direktlink:** Am Fuß der Seite diskreter Link zu `admin.html` (HQ Final-Editor).

---

### 1.5. Visuelles Mission Briefing (Intro mit Bildern & Vorlese-Audio)

Um Textüberladung zu vermeiden und den Spielern glasklar zu vermitteln, was vor Ort zu tun ist, öffnet sich nach der Wahl ein animiertes **Einsatzbefehl-Overlay**:
1. **Führungsoffizier-Porträt & Dienstsiegel:**
   * **West:** Großes Polaroid von **Polizeihauptkommissar Xaver Huber** (`assets/img/person_xaver.png`) & BND-Wappen.
   * **Ost:** Großes Polaroid von **Oberstleutnant Ronny Schenk** (`assets/img/person_schenk.png`) & MfS-Wappen.
2. **Die 3 Aktions-Schritte (Auf einen Blick erfassbar):**
   * 🚶 **1. MARSCHIEREN & ORTEN:** Folge dem Peilkompass und der Meter-Anzeige zu Station 1 am Grenzpfad.
   * 🔍 **2. ERMITTELN & EINGEBEN:** Suche vor Ort nach Hinweisen und gib gefundene Codes im Terminal ein.
   * 🎧 **3. FUNK BEACHTEN:** Halte dein Audio laut – bei Zwischenfällen meldet sich dein Einsatzleiter.
3. **Aufgabe vorlesen (Sprachausgabe & Audio-Visualizer):**
   * Taste `[ 🔊 AUFTRAG VORLESEN ]` mit animiertem Frequenz-Equalizer.
   * Nutzt Web Speech API (synthetische deutsche Stimme mit Funkrauschen) und liest den individuellen Einsatzbefehl mit Namen des Agenten laut vor.
   * Taste `[ 🚀 VERSTANDEN – EINSATZ STARTEN ▶ ]` leitet direkt in das Outdoor-HUD über.
   * Jederzeit im Terminal über `[ 📋 Einsatzbefehl anzeigen & vorlesen ]` erneut aufrufbar.

---

### 1.8. Reset-System (Spiel komplett zurücksetzen)

* Ein dedizierter Schnellzugriff-Button `[ 🔄 RESET ]` befindet sich in der oberen taktischen Kopfleiste.
* **Sicherheitsabfrage:** Ein In-Game-Warnfenster (`modal-reset-confirm`) fragt vor dem Löschen nach:
  *„Möchtest du das gesamte Spiel wirklich zurücksetzen? Alle erreichten Stationen und Codes werden gelöscht.“*
* Nach Bestätigung: `localStorage` wird bereinigt, alle Audios gestoppt, GPS-Ziele zurückgesetzt und der Spieler kehrt sauber zur Decknamens-Eingabe zurück.

---

### 2. Die Stationen: "Klipp & Klar" Outdoor-Architektur

Im Gelände herrscht maximale Klarheit. Jeder Akt und jede Station folgt einer standardisierten, sofort erfassbaren **3-Punkte-Struktur**:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎯 STATION X VON 5: [NAME DER STATION]                          │
│ ─────────────────────────────────────────────────────────────── │
│ 📍 ZIELORT: [Genauer Punkt] • Distanz: [xx m]                   │
│    [ 🗺️ AUF DER KARTE ANZEIGEN ]                                │
│ ─────────────────────────────────────────────────────────────── │
│ 🔍 DEINE AUFGABE VOR ORT:             [ 🔊 VORLESEN ]           │
│    1. Präziser Handlungsschritt am Grenzpfad.                   │
│    2. Konkreter Gegenstand / Information, die gesucht wird.     │
│ ─────────────────────────────────────────────────────────────── │
│ ⚡ CODE EINGEBEN / AKTION:                                      │
│    [ Eingabefeld               ]   [ BESTÄTIGEN ✓ ]             │
│    💡 Kurzer unmissverständlicher Tipp                          │
└─────────────────────────────────────────────────────────────────┘
```

* **Keine doppelten Eingabefelder:** Frühere redundante Befehlszeilen am Fuß des Bildschirms wurden entfernt. Es gibt genau ein aktives Eingabefeld pro Station.
* **Keine Textwüsten:** Statt ausschweifender Romantexte erhält der Cacher 1 bis maximal 2 stichpunktartige Handlungsanweisungen.
* **Vorlese-Funktion pro Station:** Ein dezenter Button `[ 🔊 VORLESEN ]` liest die aktuelle Aufgabe mit angenehmer Stimme vor (ideal beim Gehen mit Kopfhörern).
* **Aufgeräumter Bildschirm:** System-Logs und Entwickler-Konsole sind in einer eleganten einklappbaren Schublade (`<details class="terminal-log-drawer">`) am unteren Rand verstaut.

---

### 2.5. Karten-Garantie (Map Engine & Edge-to-Edge Navigation)

1. **Behebung des 0-Pixel-Kollapses:**
   * Durchgängige CSS-Flexbox-Vererbung (`.tab-content-area` mit `min-height: 0; display: flex; flex-direction: column`) garantiert, dass `#map-container` unter iOS Safari, Chrome Mobile und Android immer die volle verfügbare Bildschirmhöhe ausfüllt.
2. **Zuverlässige Kacheln (100% Verfügbarkeit):**
   * Standardmäßig angebundene OpenStreetMap-Kacheln (`tile.openstreetmap.org`) mit lokalem phosphor-grünem bzw. bernsteinfarbenem Retro-Militärfilter (CSS `invert` & `hue-rotate`). Keine Abhängigkeit von externen API-Keys oder blockierten Drittanbieter-CDNs.
   * Sollte im Funkloch kein Internetempfang bestehen, schaltet die App mit einem Klick auf die integrierte **SVG-Vektorkarte** um.
3. **Nahtlose 2-Wege-Navigation:**
   * An jeder Station bringt ein Klick auf `[ 🗺️ AUF DER KARTE ANZEIGEN ]` den Spieler direkt zur Karte, zentriert auf die Station (Zoomstufe 17) und öffnet das Info-Popup.
   * Auf der Karte befindet sich ein schwebender Button `[ 📟 ZUR STATION ]`, mit dem man blitzschnell zur Eingabe zurückkehrt.
4. **Mehrstufige Geometrie-Reparatur (`invalidateSize`):**
   * Beim Tab-Wechsel auf die Karte wird Leaflet mehrfach gestaffelt (40ms, 120ms, 250ms, 500ms) re-initialisiert, um Rendering-Verzögerungen bei CSS-Animationen vollständig abzufangen.

---

### 2.8. Akustisches Balancing (Kein lautes Rauschen beim Vorlesen)

* **Dezenter Radio-Squelch:** Beim Auslösen der Sprachausgabe (`AudioEngine.speakText`) wird das Funkrauschen auf eine sehr leise Lautstärke von **0.12** gedämpft und nach **350 Millisekunden** automatisch ausgeblendet. Es ertönt ein kurzes, authentisches Knacken ("chrrk") wie beim Einschalten eines Funkgeräts, danach ist die Stimme glasklar und ungestört verständlich.
* **Lautstärkesteuerung für alle Sounds:** `AudioEngine.play(...)` unterstützt nun explizite Lautstärkeparameter (`volume = 1.0`).
* **Hintergrund-Schleifen gedämpft:** Störfunk- und Radioschleifen laufen auf subtilen **0.08** Lautstärke, um eine stimmungsvolle Atmosphäre zu schaffen, ohne die Nerven der Spieler im Gelände zu strapazieren.

---

### 3. Taktisches HUD, Hybrid-OpenStreetMap & Menü-Leiste

Die Benutzeroberfläche ist wie ein portabler militärischer Lagekoffer der 1980er Jahre aufgebaut:

#### A) Taktische Menü-Tabs (Immer erreichbar am unteren/oberen Rand):
1. 📟 **TERMINAL:** Hauptansicht für Funksprüche, Notrufe mit Vibration, Dialekt-Audios, Replay-Button und Eingabefeld.
2. 🗺️ **KARTE (Hybrid OpenStreetMap & Vektor-Fallback):**
   * Vollständig lokale Leaflet-Bibliothek (`css/leaflet.css`, `js/leaflet.js`) ohne externe CDN-Abhängigkeit im Wald.
   * On-Map Tactical Toolbar mit `[ 📟 ZUR STATION ]`, `🎯 STANDORT`, `📍 ROUTE`, `🛰️ VEKTOR`.
   * Zeigt den befestigten Grenzweg, die Grenzlinie Bayern/Sachsen, alle Wegpunkte und den eigenen GPS-Standort (pulsierender Radar-Blip).
3. 📁 **DOSSIERS:** Aktenmappe mit individuellen Polaroid-Passfotos aller 7 beteiligten Personen (inklusive Restlichtverstärker/NVG).
4. 📻 **FUNK / RADAR:** Analoger Kurzwellen-Tuner und Geigerzähler-Anzeige.

#### B) GPS-Kompass & Entfernungspeilung:
* Zeigt permanent die **genaue Restdistanz in Metern** (z.B. `Distanz: 38 m`) und eine animierte **Peilkompass-Nadel** zum nächsten Wegpunkt.
* **Toleranz:** Ein Radius von **$\pm 10$ Metern** reicht völlig aus – sobald der Spieler den Bereich betritt, schaltet die Station automatisch frei.
* **Pfad-Assistent:** Verlässt man den befestigten Weg um mehr als 15 Meter, warnt das Display im Terminal-Layout:  
  *„Achtung: Minenstreifen! Sofort zurück auf den befestigten Grenzweg!“*

#### C) 100% In-Game Layout (Keine Browser-Popups!):
* Alle Meldungen, Warnungen, Eingabefelder und Fehlermeldungen (z.B. der 45s-Lockdown bei Scheinwerfer-Erfassung oder die Reset-Abfrage) werden **ausschließlich in maßgeschneiderten, animierten Terminal-Boxen** im 80er-Jahre-Militärlook gerendert (kein einziges unschönes Standard-`alert()`).

---

### 3. Individuelle Polaroid-Porträts aller 7 Personen (1980s Vintage-Stil)

Jede Figur erhält ein eigens generiertes, farbiges Passfoto im Stil eines vergilbten 80er-Jahre Polaroid-Dienstpasses mit leichtem Korn, Büroklammer-Effekt und Stasi/BND-Prägestempel:
1. **Polizeihauptkommissar Xaver Huber:** Bayerische Grenzpolizei Hof / BND-Verbindungsmann (markanter bayerischer Ermittler, Lederjacke, Schnurrbart).
2. **Oberstleutnant Ronny Schenk:** MfS Bezirksverwaltung Karl-Marx-Stadt (strenger DDR-Stasi-Offizier in Dienstuniform).
3. **Major Igor Woronin:** KGB-Sonderabteilung Berlin-Karlshorst (sowjetischer Offizier mit KGB-Schirmmütze und kühlem Blick).
4. **Dr. Manfred Görner ("ERDMANN"):** Der verletzte Robotron-Physiker (Brille, ziviler Trenchcoat, verwuschelte Haare, blasse Züge).
5. **Klaus-Dieter Behrendt ("ELSTER"):** Der verhaftete DDR-Kundschafter aus München (verschlagener Blick, Rollkragenpullover).
6. **Hauptmann Wolfgang Richter ("DER SCHÜTZE"):** Chef der NVA-Grenzkompanie (verdächtiger Scharfschütze im Tarnanzug).
7. **Unterleutnant Thomas Berger ("DER MAULWURF"):** Funker in der Abhör-Leitstelle (Kopfhörer um den Hals, nervöser Gesichtsausdruck).

---

### 4. Das bestätigte Drehbuch: Ablauf der Mission

```
                                  D E M A R K A T I O N S L I N I E
   BAYERN (BND / Grenzpolizei)                                        SACHSEN (MfS / Grenztruppen)
   Start: 50.330406, 12.069081                                        Start: 50.331520, 12.069700
   ===========================                                        ============================
   START (0m): BND-Feldterminal                                       START (0m): Robotron-Feldterminal
        ↓ [Befestigter Grenzweg]                                           ↓ [Befestigter Grenzweg]
   AKT 1: VORRÜCKEN (ca. 45m Wegbiegung)                              AKT 1: VORRÜCKEN (ca. 45m Wegbiegung)
   Zielperson wird losgeschickt...                                    Zielperson wird losgeschickt...
   🎲 [Zufallsereignis: Knacken im Unterholz!]                        🎲 [Zufallsereignis: NVA-Grenzstreife Motoren!]
        ↓                                                                  ↓
   💥 DER ZWISCHENFALL (ca. 85m am Pfad) 💥                           💥 DER ZWISCHENFALL (ca. 85m am Pfad) 💥
   Schüsse peitschen! Bein-Treffer! Schrei!                           Schüsse peitschen! Bein-Treffer! Schrei!
   Sirenen, Hundebellen, Panik im Funk!                               Sirenen, Hundebellen, Panik im Funk!
        ↓                                                                  ↓
   AKT 2: DIE SCHLEIFE: RÜCKZUG (zurück auf 35m)                      AKT 2: DIE SCHLEIFE: RÜCKZUG (zurück auf 35m)
   Alarm-Anruf Xaver (Bayrisch, panisch)                              Alarm-Anruf Schenk (Sächsisch, tobt)
   🔄 [Taste: "Funkspruch wiederholen"]                               🔄 [Taste: "Funkspruch wiederholen"]
   Minispiel: Scheinwerfer-Radar (Stealth)                            Minispiel: Scheinwerfer-Radar (Stealth)
   [Strafe bei Fehler: 45s Lockdown im Terminal-HUD]                  [Strafe bei Fehler: 45s Lockdown im Terminal-HUD]
        ↓                                                                  ↓
   AKT 3: TRIAGE & FEINDFUNK (ca. 60m Deckungsmulde)                  AKT 3: TRIAGE & FEINDFUNK (ca. 60m Deckungsmulde)
   ☢️ Geigerzähler aktiviert sich automatisch!                        ☢️ Geigerzähler aktiviert sich automatisch!
   Minispiel: Triage-Morsecode / Blutung stoppen                      Minispiel: Triage-Morsecode / Blutung stoppen
   Minispiel: Kurzwellen-Tuner & Störfunk knacken                     Minispiel: Kurzwellen-Tuner & Störfunk knacken
   📻 KGB-Zahlensender auf Russisch (474 kHz)                         📻 KGB-Zahlensender auf Russisch (474 kHz)
        ↓                                                                  ↓
   AKT 4: DIE TAKTISCHE VERZWEIGUNG                                   AKT 4: DIE TAKTISCHE VERZWEIGUNG
   [SUBTIL: Lautloser Austausch im toten Winkel]                      [SUBTIL: Lautloser Austausch im toten Winkel]
                 ODER                                                               ODER
   [DIREKT: Blendgranaten & Sturm-Austausch (60s)]                    [DIREKT: Blendgranaten & Sturm-Austausch (60s)]
   🟢 Restlichtverstärker (NVG) für UV-Spuren                         🟢 Restlichtverstärker (NVG) für UV-Spuren
        ↓                                                                  ↓
   AKT 5: DAS FINALE (Grenzgraben)                                    AKT 5: DAS FINALE (Grenzgraben)
   Dossier-Abgleich: Wer feuerte den Schuss?                          Dossier-Abgleich: Wer feuerte den Schuss?
   🔐 KRYPTOGRAFISCHE ENTSCHLÜSSELUNG (AES-256)                       🔐 KRYPTOGRAFISCHE ENTSCHLÜSSELUNG (AES-256)
   📍 AUSGABE: KOORDINATEN DOSE WEST (GC)                            📍 AUSGABE: KOORDINATEN DOSE OST (GC)
```

---

### 5. Audio- & Call-Erlebnis

* **Deftigste Dialekt-Sprachaufnahmen (+35% Sprechtempo):**
  * **West (Bayrisch – Xaver Huber, Hof):** Schusspeitschen, Schrei ("Aaaah mei Haxn!"), Sirenen, kläffende Hunde, gehetztes bayerisches Gebrüll.
  * **Ost (Sächsisch – Ronny Schenk, MfS):** Schusspeitschen, Schrei ("Verflucht, mein Bein!"), Sirenen, Hunde, tosender sächsischer Zornanruf.
  * **KGB (Russisch – Major Woronin):** Schneidende russische Durchsage mit zuschaltbaren Untertiteln.
* **Audio-Replay:** Jeder Funkspruch hat die Taste `[ 🔄 FUNKSPRUCH WIEDERHOLEN / REPLAY ]`.
* **PC-Testuser:** Eingabe von **`OFFLINETEST`** im Terminal aktiviert die Simulations-Leiste für den Sofatest.

---

### 6. Repository-Struktur

```
Spion/
├── index.html                   # Dual-Terminal mit Tabs (Karte, Terminal, Dossiers, Funk)
├── admin.html                   # Owner-HQ: Final-Editor (AES-256 Verschlüsselung & Test-Entschlüsselung)
├── manifest.json                # PWA Manifest (Offline)
├── service-worker.js            # Offline-Cache v4 (alle Audio-, Bild-, Karten- und Editor-Daten)
├── css/
│   ├── leaflet.css              # Lokale Leaflet-Kartenstile (100% Offline-fähig im Wald)
│   ├── terminal.css             # Amber CRT / Green CRT, Shader, Scanlines, Glitch-Effekte
│   ├── cover.css                # Cover-Screen, Agenten-Login, Briefing-Overlay & Reset-Modal
│   ├── map.css                  # Taktisches OSM-HUD, Map-Toolbar & Kontrast-Zoom-Buttons
│   ├── radar.css                # Kompass & Peilung (±10m Genauigkeit)
│   ├── nvg.css                  # Restlichtverstärker / Nachtsicht-Shader (UV-Schrift)
│   ├── geiger.css               # Geigerzähler-HUD mit Zeigerausschlag
│   ├── testbar.css              # Simulatoren-Leiste für den OFFLINETEST-Modus
│   ├── mobile.css               # Outdoor & Mobile UX (Sonnenmodus, Safe Areas, Haptik)
│   └── dossier.css              # Vintage-Akten mit den 7 Polaroid-Porträts
├── js/
│   ├── leaflet.js               # Lokale Leaflet-Bibliothek (kein CDN-Zwang im Funkloch)
│   ├── config.js                # Reale Pfad-Wegpunkte, Codes & Krypto-Chiffrat (inkl. Custom-Config-Loader)
│   ├── crypto.js                # Web Crypto API AES-256-GCM & SHA-256 Key Derivation
│   ├── audio.js                 # Sound-Engine mit Sprachausgabe (TTS), Replay & Audio-Visualizer
│   ├── gps.js                   # GPS-Tracking mit ±10m Zonen-Erkennung & Minenstreifen-Warnung
│   ├── map.js                   # Hybrid OSM Engine (verzögerte Initialisierung, Toolbar, Fallback)
│   ├── geiger.js                # Strahlungsmesser mit Audio-Knacken & Haptik
│   ├── phone.js                 # Telefon-Overlay mit Anruf-Vibration & Replay-Funktion
│   ├── radio.js                 # Kurzwellen-Tuner mit Oszilloskop & russischem Zahlensender
│   ├── stealth.js               # Minispiel: Suchscheinwerfer-Ausweichen (mit 45s Lockdown)
│   ├── triage.js                # Minispiel: Morse-Code & Blutung stoppen
│   ├── testuser.js              # 'OFFLINETEST'-Simulator für den PC-Test
│   ├── events.js                # Dynamischer Zufallsereignis-Manager
│   ├── mobile.js                # Mobile UX Engine (Wake Lock, Sonnenmodus, Kompass, State-Resume)
│   └── game.js                  # Master State Machine mit Akt 1 bis 5, Agenten-Login, Briefing & Reset
├── assets/
│   ├── audio/                   # ECHTE MP3-DATEIEN (Dialekt, Russisch, Sound-FX)
│   │   ├── incident_bavarian.mp3# Xaver Huber (Bayrisch, +35%)
│   │   ├── incident_saxon.mp3   # Ronny Schenk (Sächsisch, +35%)
│   │   ├── kgb_woronin.mp3      # KGB-Major Woronin auf Russisch
│   │   ├── russian_station.mp3  # Sowjetischer Zahlensender
│   │   ├── geiger_crackle.mp3   # Geigerzähler-Knacken
│   │   ├── heartbeat_loop.mp3   # Beschleunigender Herzschlag-Bass
│   │   ├── event_patrol.mp3     # NVA Kübelwagen Motorengeräusch
│   │   ├── event_dog.mp3        # Wachhund im Unterholz
│   │   ├── gunshot_echo.mp3     # Peitschender Schuss mit Grenzgraben-Hall
│   │   ├── sirens_dogs.mp3      # Sirenen und bellende Wachhunde
│   │   └── radio_static.mp3     # Kurzwellen-Rauschen
│   └── img/                     # HIGH-END GRAFIKEN & INDIVIDUELLE PERSONEN-PORTRAITS
│       ├── avatar.jpg           # Schräg eingebettetes Bild: 'Made by Versteckules'
│       ├── cover_border.png     # Atmosphärisches Titelbild (Grenzzaun im Nebel)
│       ├── bnd_seal.png         # Bayerisches/Bundes-Grenzpolizei Siegel
│       ├── mfs_seal.png         # DDR/Stasi-Dienststempel
│       ├── kgb_seal.png         # Sowjetisches KGB-Wappen
│       ├── person_xaver.png     # Polaroid: Xaver Huber (Grenzpolizei Hof / BND)
│       ├── person_schenk.png    # Polaroid: Ronny Schenk (MfS Karl-Marx-Stadt)
│       ├── person_woronin.png   # Polaroid: Igor Woronin (KGB Karlshorst)
│       ├── person_erdmann.png   # Polaroid: Dr. Manfred Görner (Physiker)
│       ├── person_elster.png    # Polaroid: Klaus-Dieter Behrendt (DDR-Kundschafter)
│       ├── person_richter.png   # Polaroid: Hauptmann Richter (Scharfschütze)
│       ├── person_berger.png    # Polaroid: Unterleutnant Berger (Funker/Maulwurf)
│       └── cyrillic_cipher.png  # Kyrillischer KGB-Chiffrierstreifen
├── scripts/
│   ├── generate_epic_audio.py   # Generiert Sprache + mischt Schüsse, Sirenen & Russisch ab
│   └── encrypt_coords.py        # Hilfsskript für den Owner zum Verschlüsseln der Final-Koordinaten
└── docs/
    ├── LISTING_BAYERN.html      # Geocaching.com Listing (West, D4 / T2.5)
    ├── LISTING_SACHSEN.html     # Geocaching.com Listing (Ost, D4 / T2.5)
    └── OWNER_GUIDE.md           # Konfigurationsanleitung für den Grenzweg & OFFLINETEST-Modus
```

---

## 📱 Spezielle Mobile- & Outdoor-Optimierung (UX im Gelände)

1. **Screen Wake Lock API (`js/mobile.js`):**
   * Verhindert das automatische Abschalten des Smartphone-Displays beim Laufen entlang des Grenzwegs.
   * Automatisches Re-Acquire bei App-Wechsel oder Einschalten des Displays.
   * Manueller Schnellumschalter im Kopfbereich: `💡 DISPLAY: AN / AUS`.

2. **High-Contrast Outdoor Sonnenmodus (`css/mobile.css`):**
   * Bei direktem grellem Sonnenlicht im Wald/Feld: Umschaltbar auf reines Tiefschwarz mit neon-gelber Kontrastschrift (`#ffff00`).
   * CRT-Scanlines und Unschärfe-Filter werden im Sonnenmodus komplett deaktiviert.
   * Schriftgrößen um +20% vergrößert für ermüdungsfreies Ablesen aus Armlänge beim Gehen.

3. **Echter Hardware-Kompass (DeviceOrientation API):**
   * Berücksichtigt die physische Drehung des Smartphones in der Hand (inkl. iOS `webkitCompassHeading`).
   * Die Peilnadel dreht sich flüssig zur Zielposition relativ zur Blickrichtung des Cachers.

4. **Taktile Haptik (Vibration API):**
   * Subtiles haptisches Feedback bei jedem Knopfdruck (auch mit Handschuhen spürbar).
   * Markantes Doppel-Vibrieren beim Betreten der $\pm 10$m Checkpoint-Zone.
   * Alarm-Vibration beim Verlassen des befestigten Pfades (Minenstreifen-Warnung).

5. **Live GPS-Genauigkeitsanzeige:**
   * Ampelanzeige in der Statusleiste: `🟢 GPS: ±3m` (Optimal), `🟡 GPS: ±9m` (Gut), `🔴 GPS: ±24m` (Schwach).
   * Cacher wissen sofort, ob das Satellitensignal stabil ist.

6. **iOS Safe Areas & Einhand-Ergonomie:**
   * Volle Unterstützung von `env(safe-area-inset-top)` und `env(safe-area-inset-bottom)` (Dynamic Island, Notch, Home Bar).
   * `touch-action: manipulation;` verhindert versehentlichen Doppeltipp-Zoom.
   * Formularfelder mit `font-size: 16px;` verhindern automatisches Hereinzoomen in iOS Safari.
   * Daumen-optimierte Touch-Ziele (Mindesthöhe 48–56px).
   * Schwebender Schnell-Zentrier-Button (`🎯 STANDORT ZENTRIEREN`) direkt auf der Karte.

7. **Robuste State-Persistence (Automatisches Fortsetzen):**
   * Automatisches Speichern des aktuellen Akts, Checkpoints und gelöster Rätsel in `localStorage`.
   * Bei eingehendem Anruf, Akkuwechsel oder Tab-Schließen geht der Missionsstand im Gelände nicht verloren.

---

## 🛠️ 8. Die Owner-Anwendung: HQ Final-Editor (`admin.html`)

Um die Final-Dosen und deren Koordinaten jederzeit flexibel anpassen oder im Gelände umzulegen, ohne Code neu zu kompilieren oder Python-Skripte auszuführen, steht die Standalone-Web-App **`admin.html`** zur Verfügung:

1. **Echtzeit-Pflege beider Final-Dosen:**
   * **WEST (Bayern / BND):** Klartext-Koordinaten & Cache-Hinweis (z.B. `N 50° 19.835' E 012° 04.160' (Dose West: Unter Wurzel...)`).
   * **OST (Sachsen / MfS):** Klartext-Koordinaten & Cache-Hinweis (z.B. `N 50° 19.905' E 012° 04.195' (Dose Ost: Hinter altem Grenzstein...)`).
2. **Schlüssel-Parameter (Rätsel-Lösungen):**
   * Startcode (Standard: `1983`), Triagecode (`SOS`), Frequenzen (`462` / `480`), Verdächtiger Schütze (`RICHTER`).
3. **1-Klick-Verschlüsselung & Live-Speicherung:**
   * Button `[ 💾 1-KLICK: VERSCHLÜSSELN & LIVE SPEICHERN ]`:
     Nutzt Web Crypto API (AES-256-GCM + SHA-256 Key Derivation) direkt im Browser.
     Speichert das Ergebnis in `localStorage["SPION_CUSTOM_FINAL_CONFIG"]`.
     `config.js` priorisiert diese Werte automatisch, sodass das Spiel sofort mit den neuen Koordinaten läuft.
4. **Prüfung & Code-Export:**
   * `[ 🧪 ENTSCHLÜSSELUNG TESTEN ]`: Simuliert den Entschlüsselungsvorgang der Spieler zur 100%igen Funktionsprüfung.
   * `[ 📋 CODE FÜR JS/CONFIG.JS KOPIEREN ]`: Generiert das fertige JavaScript-Snippet zur dauerhaften Übernahme in das Git-Repository.
   * `[ 🔄 WERKS-WERTE ZURÜCKSETZEN ]`: Stellt die Werkseinstellungen mit einem Klick wieder her.

