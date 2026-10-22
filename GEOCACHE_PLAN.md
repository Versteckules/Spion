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
  * Verhindert unpersönliche Sessions; Name wird dauerhaft gespeichert und im gesamten HUD angezeigt (Default: `Agent-07` / `Genosse-Falke`, kein Blockieren mit Fehlermeldungen).
  * Bei Eingabe von `OFFLINETEST`, `TEST` oder `SOFA` schaltet die App sofort in den Sofa-Testmodus um.
* **Fraktions-Auswahl mit Direktstart (Weniger ist mehr):**
  * `[ 🦁 MISSION WEST (Bayern / BND) ]` – Start bei Münchenreuth (`50.330406, 12.069081`)
  * `[ ⚒️ MISSION OST (Sachsen / MfS) ]` – Start bei Gutenfürst (`50.331520, 12.069700`)
  * **Sofortiger Einsatzstart:** Klick auf die Fraktion leitet ohne zeitraubende Zwischenmodale direkt zu Station 1 über!
* **Startseiten-Schnellzugriff:**
  * `[ 🗺️ EINSATZKARTE ANSEHEN ]`: Öffnet sofort die Übersichtskarte des Grenzabschnitts (Bayern/Sachsen).
  * `[ 🛠️ OFFLINE-TESTMODUS ]`: 1-Klick-Aktivierung der Simulationsleiste am oberen Bildschirmrand.
  * `[ 🔄 AKTUALISIEREN / CACHE LEEREN ]`: Bereinigt Browser-Caches und Service-Worker bei Updates.
* **Owner-Direktlink:** Am Fuß der Seite diskreter Link zu `admin.html` (HQ Final-Editor).

---

### 1.5. Direktstart & Station 1 ("Weniger ist mehr")

Um Textüberladung und Frustration zu verhindern, verzichtet der Startflow auf lange Zwischenfenster mit doppelten Handlungsanweisungen:
1. **Sofortiger Einstieg bei Station 1:**
   * Nach Klick auf West oder Ost befindet sich der Agent unmittelbar im Einsatz-Terminal von Station 1.
   * Keine 3 doppelten Hinweiskästen mehr – die Station selbst erklärt klipp und klar, was vor Ort zu tun ist.
2. **Kompaktes Führungs-Briefing (optional im Terminal aufrufbar):**
   * **West:** Porträt von **Polizeihauptkommissar Xaver Huber** (`assets/img/person_xaver.png`) & BND-Wappen.
   * **Ost:** Porträt von **Oberstleutnant Ronny Schenk** (`assets/img/person_schenk.png`) & MfS-Wappen.
   * Ein prägnanter 1-Satz-Missionsbefehl statt Textwüsten.
3. **Glasklare Vorlese-Funktion (20% schneller, absolut rauschfrei):**
   * Taste `[ 🔊 VORLESEN ]` liest die Aufgaben mit zügiger, dynamischer Militärstimme (`rate: 1.25`) vor.
   * **Kein Funkrauschen/Zischen beim Vorlesen:** Die Sprachausgabe ertönt vollkommen sauber und ungestört ohne störenden Radio-Squelch.

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

1. **Behebung des 0-Pixel-Kollapses & Verlässliche Höhe:**
   * `#tab-map.active` und `#map-container` besitzen feste Fallback-Dimensionen (`height: calc(100vh - 120px); min-height: 400px; width: 100%`).
   * Leaflet wird bei Container-Größe 0 im Hintergrund geschützt und beim Wechsel auf den Karten-Tab automatisch auf die realen Pixelabmessungen re-initialisiert (`map.invalidateSize(true)`).
2. **Glasklare Kachelsichtbarkeit (Kein Schwarzbild durch Invertierung):**
   * Standardmäßig angebundene OpenStreetMap-Kacheln (`tile.openstreetmap.org`) mit dezentem Kontrastfilter (`contrast(106%) brightness(96%)`) statt extremem Schwarz-Invert-Filter. Straßen, Wege, Wälder und Grenzgraben sind auch im Sonnenlicht im Gelände 100% deutlich sichtbar.
   * Sollte im Funkloch kein Internetempfang bestehen, schaltet die App nahtlos auf die integrierte **SVG-Vektorkarte** um (`🛰️ VEKTOR`).
3. **Nahtlose 2-Wege-Navigation:**
   * An jeder Station bringt ein Klick auf `[ 🗺️ AUF DER KARTE ANZEIGEN ]` den Spieler direkt zur Karte, zentriert auf die Station (Zoomstufe 17) und öffnet das Info-Popup.
   * Auf der Karte befindet sich ein schwebender Button `[ 📟 ZUR STATION ]`, mit dem man blitzschnell zur Eingabe zurückkehrt.
   * Von der Startseite aus erlaubt `[ 🗺️ EINSATZKARTE ANSEHEN ]` den direkten Blick auf das Gelände noch vor dem Spielstart.

---

### 2.8. Akustisches Balancing (Kein Rauschen beim Vorlesen, 20% schneller)

* **Absolut rauschfreie Sprachausgabe:** Beim Auslösen von `AudioEngine.speakText` wird kein Funkrauschen (`radio_static.wav`) abgespielt. Die Stimme ist sofort glasklar und ungestört verständlich.
* **20% schnelleres Sprechtempo:** Die Sprechgeschwindigkeit wurde von `1.05` auf `1.25` angehoben. Anweisungen klingen prägnant, dynamisch und militärisch zügig.
* **Lautstärkesteuerung & dezente Hintergrund-Schleifen:** Dialekt-Notrufe und Effekte klingen authentisch, ohne zu übersteuern.

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

### 4.5. Die interaktiven Minispiele & Aktions-Mechaniken im Detail

Jede Station bietet ein handfestes, abwechslungsreiches Minispiel im authentischen Kalter-Krieg-Militärlook:

1. **Station 1: Terminal-Entriegelung (Code 1983)**
   * **Ziel:** Aktivierung des mobilen Einsatzkoffers durch Eingabe des Operationsjahres.
   * **Mechanik:** Grünes / Bernsteinfarbenes Terminal-Tastenfeld.
   * **Lösung:** `1983`.
   * **Sofatest-Hilfe:** Direkter Button `[ ⚡ CODE '1983' EINFÜGEN & DIREKT WEITER ▶ ]` füllt das Feld aus und schaltet Station 2 frei.

2. **Station 2: Vorrücken & Der Zwischenfall (Schusswechsel & Notruf)**
   * **Ziel:** Vorrücken auf dem befestigten Grenzweg in Richtung Demarkationslinie (ca. 45–85m).
   * **Mechanik:** GPS-Erkennung des Zielgebiets oder Sofatest-Button.
   * **Der Zwischenfall:**
     * Peitschender Schuss mit Grenzgraben-Hall (`gunshot_echo.wav`), Schrei des Verwundeten, Sirenen und bellende Grenzhunde (`sirens_dogs.wav`).
     * **Telefon-Simulator (`phone.js`):** Bildschirm vibriert (`AudioEngine.vibrate`), ein Anruffenster mit grünem Hörer poppt auf.
     * **West:** Aufgeregter bayerischer Notruf von Polizeihauptkommissar Xaver Huber (`incident_bavarian.mp3`, Hof).
     * **Ost:** Tobender sächsischer Anruf von MfS-Oberstleutnant Ronny Schenk (`incident_saxon.mp3`, Karl-Marx-Stadt).
     * Taste `[ 🔄 FUNKSPRUCH WIEDERHOLEN / REPLAY ]` erlaubt beliebiges Nachhören.
   * **Trigger:** GPS-Eintritt (<10m) ODER Stations-Button `[ 💥 ZIELBEREICH ERREICHT • ZWISCHENFALL & SCHUSSWECHSEL AUSLÖSEN ▶ ]` ODER Testbar `[ 💥 3. Schuss & Notruf ]`.

3. **Minispiel 1: Stealth-Radar & NVA-Suchscheinwerfer (`stealth.js`)**
   * **Ziel:** Taktischer Rückzug im Zickzack, ohne von den rotierenden Scheinwerfern der Grenztürme erfasst zu werden.
   * **Mechanik:** Kreisrundes Radar-Display im Phosphor-Look. Zwei Lichtkegel rotieren über das Suchfeld. Der Agent muss 15 Sekunden lang im toten Winkel bleiben bzw. rechtzeitig `[ IN DECKUNG GEHEN ]` drücken.
   * **Strafe:** Bei Erfassung ertönt Flutlicht-Alarm und ein 45-Sekunden-Lockdown blockiert das Terminal.
   * **Trigger:** Startet automatisch nach Beendigung des Notrufs ODER direkt über die Testbar `[ 🚨 Stealth-Radar ]`.

4. **Minispiel 2: Triage-Biomonitor & Akustischer Morse-Code (`triage.js`)**
   * **Ziel:** Stabilisierung der angeschossenen Zielperson (Dr. Manfred Görner / Klaus-Dieter Behrendt) in der Deckungsmulde.
   * **Mechanik:**
     * Vitaldaten-Monitor: Fallender Blutdruck (85/50 mmHg), kritische Herzfrequenz (`heartbeat_loop.wav`).
     * Akustischer Notfallsender: Ein Morse-Piepton ertönt (`morse_beacon.wav`) im Rhythmus `... --- ...`.
     * Terminal-Keypad: Eingabe des Morse-Codes `SOS` zum Entsperren des Verbandskastens und Bestätigung von `[ DRUCKVERBAND ANLEGEN ]`.
   * **Sofatest-Hilfe:** Button `[ ⚡ CODE 'SOS' AUTOMATISCH EINGEBEN (TEST) ▶ ]` im Minispiel.
   * **Trigger:** Erreichen von Station 3 ODER Testbar `[ ✚ 4. Triage (SOS) ]`.

5. **Minispiel 3: Analoger Kurzwellen-Tuner & KGB-Funkspruch (`radio.js`)**
   * **Ziel:** Abfangen des sowjetischen Funkspruchs aus Karlshorst durch genaues Abstimmen des Funkempfängers.
   * **Mechanik:**
     * Frequenzskala von 400 bis 520 kHz mit Schieberegler und grünem Oszilloskop.
     * Weißes Rauschen (`radio_static.wav`), das leiser wird, je näher man der Zielfrequenz kommt.
     * **Zielfrequenz:** `462 kHz` (West / BND) bzw. `480 kHz` (Ost / MfS).
     * Bei exakter Abstimmung: Russischer Funkspruch von KGB-Major Igor Woronin (`kgb_woronin.mp3`) mit zuschaltbaren deutschen Untertiteln.
   * **Sofatest-Hilfe:** Button `[ ⚡ ZIELFREQUENZ SOFORT EINSTELLEN (TEST) ▶ ]`.
   * **Trigger:** Nach Triage ODER Testbar `[ 📻 Radio (KGB) ]`.

6. **Station 4: Taktische Verzweigung (Entscheidungsspiel)**
   * **Ziel:** Wahl der Flucht- und Übergaberoute unter Zeitdruck.
   * **Option A (Subtil):** Kriechen durch das alte Bachrohr im toten Winkel des Schießplatzes.
   * **Option B (Direkt / Sturm):** Einsatz von Nebel- und Blendgranaten mit 60-Sekunden-Countdown.
   * **Restlichtverstärker (NVG):** Umschalten auf Nachtsicht-Modus (`nvg.css`) mit grünem Phosphor-Filter zum Entziffern fluoreszierender UV-Kreidemarkierungen.
   * **Trigger:** Erreichen von Station 4 ODER Testbar `[ ⚡ 5. Fluchtplan ]`.

7. **Station 5: Das Krypto-Finale & Maulwurf-Entlarvung**
   * **Ziel:** Identifikation des Schützen und Entschlüsselung der Koordinaten des physischen Caches.
   * **Mechanik:**
     * **Dossier-Abgleich:** Die 7 Polaroid-Dossiers werden nach Schusswinkel, Waffenkaliber und Dienstzeiten analysiert. Ergebnis: **Hauptmann Wolfgang Richter**.
     * **Kryptografische Entschlüsselung:** Echte militärische AES-256-GCM Entschlüsselung via Web Crypto API im Terminal.
     * **Ergebnis:** Ausgabe der exakten Geocache-Final-Koordinaten für Dose West (Bayern) bzw. Dose Ost (Sachsen).
   * **Trigger:** Erreichen von Station 5 ODER Testbar `[ 🎯 6. Finale (Safe) ]`.

---

### 4.6. Sofatest & 1-Klick-Direktsteuerung (Warum vorher nichts passierte & wie es jetzt funktioniert)

#### Warum schien es vorher so, als passiere nichts?
1. **Fehlende Vibrations-Methode:** Im Telefon-Simulator und den Minispielen wurde `AudioEngine.vibrate()` aufgerufen. Da diese Funktion fehlte, brach JavaScript mit einem stillen `TypeError` ab, bevor das Anruffenster mit Xaver/Schenk angezeigt werden konnte. (Behoben in Version 8!)
2. **GPS-Wartezustand im Wohnzimmer:** Die Stationen warteten auf eine reale Annäherung auf unter 10 Meter an die Grenzkoordinaten. Wer am Schreibtisch saß, blieb in Station 1 bzw. 2 hängen.
3. **Frühere Testbar simulierte nur GPS-Zahlen:** Die alten `P1`–`P5`-Buttons änderten nur die Breitengrade, lösten aber keine Aktionsübergänge aus.

#### Wie man jetzt jedes Minispiel sofort mit 1 Klick ausprobiert:
* **Option 1 (Die neue Testbar am oberen Bildschirmrand):**
  * Klick auf `[ 🛠️ OFFLINE-TESTMODUS ]` auf dem Startbildschirm (oder Codename `OFFLINETEST`).
  * In der Leiste oben sind jetzt dedizierte **Direkt-Aktions-Buttons**:
    * `[ 🔘 1. Start (1983) ]` – Startet Station 1 und füllt 1983 ein.
    * `[ 📍 2. Vorrücken ]` – Schaltet auf Station 2.
    * `[ 💥 3. Schuss & Notruf ]` – Löst sofort den Schusswechsel und den Telefonanruf aus!
    * `[ 🚨 Stealth-Radar ]` – Öffnet direkt das Suchscheinwerfer-Radar.
    * `[ ✚ 4. Triage (SOS) ]` – Öffnet direkt den Triage-Biomonitor mit SOS-Code.
    * `[ 📻 Radio (KGB) ]` – Öffnet direkt den analogen Kurzwellen-Tuner.
    * `[ ⚡ 5. Fluchtplan ]` – Öffnet die taktische Verzweigung (Subtil vs. Sturm).
    * `[ 🎯 6. Finale (Safe) ]` – Öffnet das Krypto-Finale mit Safe-Entschlüsselung.
* **Option 2 (Direkt im Stations-Terminal):**
  * An jeder Station gibt es nun auffällige gelbe Schnell-Aktions-Buttons:
    * Station 1: `[ ⚡ CODE '1983' EINFÜGEN & DIREKT WEITER ▶ ]`
    * Station 2: `[ 💥 ZIELBEREICH ERREICHT • ZWISCHENFALL & SCHUSSWECHSEL AUSLÖSEN ▶ ]`
    * Station 3: `[ ⚡ CODE 'SOS' AUTOMATISCH EINGEBEN (TEST) ▶ ]`
    * Station 3b: `[ ⚡ ZIELFREQUENZ SOFORT EINSTELLEN (TEST) ▶ ]`

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

