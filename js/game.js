/**
 * Master Game Engine & State Machine für Geocache "Operation Schattentausch"
 * - Steuert Akt 1 bis Akt 5
 * - Handhabt Tab-Wechsel (Terminal, Karte, Dossiers, Funk)
 * - In-Game Dialoge & Fehleranzeigen (kein Browser-alert)
 * - Verzweigung (Subtil vs. Direkt)
 * - Krypto-Entschlüsselung (AES-256) der Final-Dosen
 */

class GameEngineClass {
    constructor() {
        this.faction = "west"; // "west" oder "ost"
        this.currentAct = 0; // 0: Cover, 1: Start, 2: Advance/Incident, 3: Fallback/Triage, 4: Branch, 5: Final
        this.currentStepIdx = 0;
        this.branchChoice = null; // "subtil" oder "direkt"
        this.isNVGActive = false;
        this.playerName = localStorage.getItem("spion_agent_name") || "Agent";
        this.isBriefingSpeaking = false;
        this.solvedSteps = {
            startCode: "",
            triageCode: "",
            radioFreq: "",
            moleName: ""
        };
    }

    /**
     * Initialize Game on page load
     */
    init() {
        // Read URL param ?side=west|ost
        const urlParams = new URLSearchParams(window.location.search);
        const side = urlParams.get('side');
        if (side === 'ost' || side === 'east') {
            this.setFaction('ost');
        } else if (side === 'west') {
            this.setFaction('west');
        }

        // Initialize Map
        if (window.MapEngine) {
            window.MapEngine.init("map-container");
        }

        // Bind Navigation Tabs
        this.bindTabs();

        // Bind Global Input for OFFLINETEST
        const terminalInput = document.getElementById("terminal-cmd-input");
        if (terminalInput) {
            terminalInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    this.handleCommand(terminalInput.value);
                    terminalInput.value = "";
                }
            });
        }

        // GPS Event Handlers
        if (window.GPSEngine) {
            window.GPSEngine.onLocationUpdate = (loc) => this.onGPSUpdate(loc);
            window.GPSEngine.onZoneEntered = (dist) => this.onZoneEntered(dist);
            window.GPSEngine.onOffPathWarning = (isOff, dist) => this.onOffPathWarning(isOff, dist);
        }

        // Initialize Mobile UX Engine (Screen Wake Lock, Haptics, Sunlight mode, Compass)
        if (window.MobileUX) {
            window.MobileUX.init();
        }

        // Pre-fill agent name on landing screen if stored
        const nameInput = document.getElementById("agent-callsign-input");
        if (nameInput) {
            if (this.playerName && this.playerName !== "Agent") {
                nameInput.value = this.playerName;
            }
            nameInput.addEventListener("input", () => {
                nameInput.classList.remove("input-error");
                const err = document.getElementById("agent-name-error");
                if (err) err.style.display = "none";
            });
        }

        // Secret owner easter-egg: 3-clicks on avatar unlocks simulation bar
        const avatarFrame = document.getElementById("owner-avatar-frame");
        if (avatarFrame) {
            let clickCount = 0;
            let clickTimer = null;
            avatarFrame.addEventListener("click", () => {
                clickCount++;
                clearTimeout(clickTimer);
                if (clickCount >= 3) {
                    clickCount = 0;
                    if (window.TestUserSimulator) {
                        window.TestUserSimulator.activate();
                    }
                } else {
                    clickTimer = setTimeout(() => { clickCount = 0; }, 700);
                }
            });
        }

        // Render Cover Screen initially
        this.showScreen("cover-screen");

        // Check if player has an active outdoor mission to resume
        this.checkSavedMissionResume();
    }

    /**
     * Agent Name Check & Open Visual Mission Briefing
     */
    handleFactionSelection(factionKey) {
        const input = document.getElementById("agent-callsign-input");
        const name = input ? input.value.trim() : "";
        const err = document.getElementById("agent-name-error");

        if (!name) {
            if (input) input.classList.add("input-error");
            if (err) err.style.display = "block";
            if (window.MobileUX) window.MobileUX.vibrate([80, 40, 80]);
            if (input) input.focus();
            return;
        }

        if (input) input.classList.remove("input-error");
        if (err) err.style.display = "none";

        this.playerName = name;
        this.faction = factionKey;
        localStorage.setItem("spion_agent_name", name);

        this.openMissionBriefing(factionKey);
    }

    /**
     * Open Briefing Overlay Modal with officer portrait and speech setup
     */
    openMissionBriefing(factionKey) {
        const isWest = factionKey === "west";
        const modal = document.getElementById("mission-briefing-modal");
        if (!modal) return;

        const leaderImg = document.getElementById("briefing-leader-img");
        const leaderName = document.getElementById("briefing-leader-name");
        const leaderRank = document.getElementById("briefing-leader-rank");
        const leaderQuote = document.getElementById("briefing-leader-quote");
        const agentDisplay = document.getElementById("briefing-agent-display");

        if (leaderImg) leaderImg.src = isWest ? "assets/img/person_xaver.png" : "assets/img/person_schenk.png";
        if (leaderName) leaderName.textContent = isWest ? "Xaver Huber" : "Ronny Schenk";
        if (leaderRank) leaderRank.textContent = isWest ? "Polizeihauptkommissar • BND Bayern" : "Oberstleutnant • MfS Karl-Marx-Stadt";
        if (leaderQuote) leaderQuote.textContent = isWest ? 
            '"Hoid di zamm, Agent! Aufpassen am Grenzgraben. Bei Station 1 meldest du dich per Funk."' :
            '"Genosse Agent, Befehl: Vorrücken auf dem Kolonnenweg. Wachsam bleiben, keine Fehler!"';
        if (agentDisplay) agentDisplay.textContent = this.playerName;

        // Reset audio button state
        const btn = document.getElementById("btn-briefing-audio");
        const wave = document.getElementById("briefing-audio-wave");
        if (btn) {
            btn.innerHTML = `<span>🔊</span> AUFTRAG VORLESEN`;
            btn.classList.remove("playing");
        }
        if (wave) wave.classList.remove("active");
        this.isBriefingSpeaking = false;

        modal.style.display = "flex";
    }

    /**
     * Re-open Briefing Modal from inside terminal
     */
    openBriefingModal() {
        this.openMissionBriefing(this.faction || "west");
    }

    /**
     * Read aloud mission briefing via SpeechSynthesis & AudioEngine
     */
    toggleBriefingAudio() {
        const btn = document.getElementById("btn-briefing-audio");
        const wave = document.getElementById("briefing-audio-wave");
        const isWest = this.faction === "west";

        if (this.isBriefingSpeaking) {
            AudioEngine.stopAll();
            this.isBriefingSpeaking = false;
            if (btn) {
                btn.innerHTML = `<span>🔊</span> AUFTRAG VORLESEN`;
                btn.classList.remove("playing");
            }
            if (wave) wave.classList.remove("active");
            return;
        }

        this.isBriefingSpeaking = true;
        if (btn) {
            btn.innerHTML = `<span>⏸️</span> ANHALTEN`;
            btn.classList.add("playing");
        }
        if (wave) wave.classList.add("active");

        const speechText = isWest ?
            `Achtung Agent ${this.playerName}! Hier spricht Xaver Huber von der Grenzpolizei Hof. Dein Auftrag: Rücke vorsichtig auf dem befestigten Grenzweg vor zu Station eins. Achte auf verdächtige Geräusche und verlasse niemals den befestigten Pfad wegen der Minengefahr. Bei Station eins gibst du den BND-Zugangscode im Terminal ein. Viel Erfolg!` :
            `Genosse Agent ${this.playerName}! Hier spricht Oberstleutnant Schenk, Ministerium für Staatssicherheit. Befehl: Vorrücken auf dem Kolonnenweg Richtung Demarkationslinie. Halte die Augen offen nach BND-Spionen. Sobald du Station eins erreichst, gibst du den Robotron-Code im Terminal ein. Abmarsch!`;

        AudioEngine.speakText(speechText, { rate: 1.05, pitch: isWest ? 0.95 : 1.0 },
            () => {},
            () => {
                this.isBriefingSpeaking = false;
                if (btn) {
                    btn.innerHTML = `<span>🔊</span> NOCHMAL VORLESEN`;
                    btn.classList.remove("playing");
                }
                if (wave) wave.classList.remove("active");
            }
        );
    }

    /**
     * Confirm Briefing & Actually Start Gameplay
     */
    startConfirmedMission() {
        if (this.isBriefingSpeaking) {
            AudioEngine.stopAll();
            this.isBriefingSpeaking = false;
        }
        const modal = document.getElementById("mission-briefing-modal");
        if (modal) modal.style.display = "none";

        this.selectFaction(this.faction || "west");

        const hudAgent = document.getElementById("hud-agent-name");
        if (hudAgent) hudAgent.textContent = this.playerName;
    }

    /**
     * Reset Game Logic with Prior Confirmation Modal
     */
    promptReset() {
        const modal = document.getElementById("modal-reset-confirm");
        if (modal) modal.style.display = "flex";
        if (window.MobileUX) window.MobileUX.vibrate(25);
    }

    cancelReset() {
        const modal = document.getElementById("modal-reset-confirm");
        if (modal) modal.style.display = "none";
    }

    confirmReset() {
        AudioEngine.stopAll();
        if (window.MobileUX) {
            window.MobileUX.clearSavedProgress();
        }
        this.currentAct = 0;
        this.currentStepIdx = 0;
        this.branchChoice = null;
        this.isNVGActive = false;
        this.solvedSteps = {
            startCode: "",
            triageCode: "",
            radioFreq: "",
            moleName: ""
        };

        const modal = document.getElementById("modal-reset-confirm");
        if (modal) modal.style.display = "none";

        // Return to cover
        this.showScreen("cover-screen");

        const input = document.getElementById("agent-callsign-input");
        if (input && this.playerName && this.playerName !== "Agent") {
            input.value = this.playerName;
        }

        this.addTerminalLog("SYSTEM ZURÜCKGESETZT. Bereit für neuen Agenteneinsatz.");
    }

    /**
     * Choose Faction & Start Mission
     */
    selectFaction(factionKey) {
        this.setFaction(factionKey);
        if (window.AudioEngine) {
            window.AudioEngine.init();
            window.AudioEngine.play("assets/audio/radio_static.wav", 1.0, false);
        }

        // Mobile UX: Keep screen awake during outdoor walking & request compass sensor
        if (window.MobileUX) {
            window.MobileUX.requestWakeLock();
            if (typeof window.MobileUX.requestOrientationPermission === "function") {
                window.MobileUX.requestOrientationPermission();
            }
        }

        // Hide Cover, Show App HUD
        document.getElementById("cover-screen").style.display = "none";
        document.getElementById("app-main").style.display = "flex";

        // Load Faction Data
        const cfg = factionKey === "west" ? MISSION_CONFIG.WEST : MISSION_CONFIG.OST;
        document.body.className = `theme-${cfg.THEME}`;
        document.getElementById("hud-faction-title").textContent = cfg.NAME;
        const hudAgent = document.getElementById("hud-agent-name");
        if (hudAgent) hudAgent.textContent = this.playerName;

        // Load Path into Map
        if (window.MapEngine) {
            window.MapEngine.loadFactionPath(cfg.CHECKPOINTS);
        }
        if (window.GPSEngine) {
            window.GPSEngine.setPathWaypoints(cfg.CHECKPOINTS);
        }

        // Refresh testuser bar if simulation is active
        if (window.TestUserSimulator && window.TestUserSimulator.isActive) {
            window.TestUserSimulator.renderBar();
        }

        // Start at Act 1 (Checkpoint 1)
        this.startAct1();

        // Start Background Events
        if (window.EventsEngine) {
            window.EventsEngine.start();
        }
    }

    setFaction(f) {
        this.faction = f;
        window.CurrentFaction = f;
    }

    /**
     * AKT 1: Start am Grenzpfad (0m)
     */
    startAct1() {
        this.currentAct = 1;
        this.currentStepIdx = 0;
        const cp = (this.faction === "west" ? MISSION_CONFIG.WEST : MISSION_CONFIG.OST).CHECKPOINTS[0];
        GPSEngine.setTarget(cp.lat, cp.lon);
        GPSEngine.startTracking();

        this.switchTab("terminal");
        this.addTerminalLog(`MISSION INITIALISIERT: ${MISSION_CONFIG.TITLE}`);
        this.addTerminalLog(`POSITION: ${cp.name} [50° 19.xxx]`);
        this.addTerminalLog(`BEFEHL: Bewegen Sie sich zum Startpunkt und geben Sie die Grenz-Kennung ein.`);

        this.saveCurrentProgress();
        this.renderAct1UI();
    }

    renderAct1UI() {
        const area = document.getElementById("terminal-mission-area");
        area.innerHTML = `
            <div class="act-card">
                <div class="act-title">AKT 1: INITIALISIERUNG GRENZPOSTEN [0 METER]</div>
                <div class="act-desc">
                    Willkommen im Einsatzgebiet an der Grenze Bayern/Sachsen. Um das BND/MfS-Feldterminal mit der Leitstelle zu synchronisieren, geben Sie die 4-stellige Jahreszahl der Geheimoperation ein.
                </div>
                <div class="terminal-action-row">
                    <input type="text" id="input-act1-code" placeholder="4-stelliger Code..." class="terminal-input-field" maxlength="8" />
                    <button id="btn-act1-submit" class="btn-terminal-action primary">BESTÄTIGEN</button>
                </div>
                <div class="act-hint">HINWEIS: Das Einsatzjahr des Schattentauschs (Herbst...).</div>
            </div>
        `;

        document.getElementById("btn-act1-submit").onclick = () => {
            const val = document.getElementById("input-act1-code").value.trim();
            if (val === MISSION_CONFIG.SOLUTIONS.START_CODE) {
                this.solvedSteps.startCode = val;
                this.showInGameModal("TERMINAL SYNCHRONISIERT", "Code korrekt! Verbindung zur Leitstelle hergestellt. Zielperson wird losgeschickt. Rücken Sie vor zu Checkpoint 2!", "VORRÜCKEN (AKT 2)");
                this.startAct2();
            } else {
                this.showInGameModal("ZUGRIFF VERWEIGERT", "Falsche Kennung! Überprüfen Sie Ihre Missionsunterlagen.", "ERNEUT VERSUCHEN");
            }
        };
    }

    /**
     * AKT 2: Vorrücken (45m) -> ZWISCHENFALL (85m)
     */
    startAct2() {
        this.currentAct = 2;
        this.currentStepIdx = 1;
        const cfg = this.faction === "west" ? MISSION_CONFIG.WEST : MISSION_CONFIG.OST;
        const cp2 = cfg.CHECKPOINTS[1];
        GPSEngine.setTarget(cp2.lat, cp2.lon);

        this.addTerminalLog(`AKT 2 AKTIV: Vorrücken entlang des Grenzwegs zu Punkt 2 (Wegbiegung).`);
        this.saveCurrentProgress();

        const area = document.getElementById("terminal-mission-area");
        area.innerHTML = `
            <div class="act-card">
                <div class="act-title">AKT 2: VORRÜCKEN & SICHTKONTAKT [45 METER]</div>
                <div class="act-desc">
                    Folgen Sie dem befestigten Grenzweg. Der Zielperson wurde das Vorrücksignal gegeben. Nähern Sie sich dem Übergabepunkt.
                </div>
                <div class="radar-status-live">
                    DISTANZ ZUM NÄCHSTEN PUNKT: <span id="act2-live-dist" class="highlight">-- m</span>
                </div>
            </div>
        `;
    }

    /**
     * Trigger Gunshot Incident at Checkpoint 3 (85m)
     */
    triggerIncident() {
        this.currentAct = 2.5;
        this.currentStepIdx = 2;

        // Play gunshot audio echo & tactical jolt vibration
        AudioEngine.play("assets/audio/gunshot_echo.wav", 1.0, false);
        if (window.MobileUX) {
            window.MobileUX.vibrate([200, 100, 400]);
        }

        const isWest = this.faction === "west";
        const caller = isWest ? MISSION_CONFIG.PERSONS[0] : MISSION_CONFIG.PERSONS[1];
        const audio = isWest ? "assets/audio/incident_bavarian.mp3" : "assets/audio/incident_saxon.mp3";
        const transcript = isWest ?
            "„Zefix noamoi! Ludwig, geh in d'Deckung! Um Himmels Willn, wer hodn do gschossn?! De drübm ham auf unsern Mo gschossn, mitten in Haxn neigschossn! Er robbt zruck ins Schilf, er bliad wia a Sau! Rumpeldipumpel zurück zu Posten zwoa, oba zackich! Pass auf de Suchscheinwerfer auf, sonst brennt da Huad!“" :
            "„Zergobbl noch eemol! Halt, Deckung, Genosse! Was fürn Hirnie hat n da jeschossn?! De imperialistische Grenzpolizei hat unsre Zielperson voll ins Beene jetroffn! De Kacke dampft lichterloh! Mach de Glotzn uff, renn sofort zurück zur Schutzmulde bei Position zwo! Wenn dich de Suchscheinwerfer erwischen, machste Bekanntschaft mit Bautzen!“";

        // Trigger Incoming Panic Call
        PhoneSimulator.triggerCall({
            name: caller.name,
            org: caller.org,
            img: caller.img,
            audioFile: audio,
            transcript: transcript,
            onComplete: () => {
                this.startFallbackStealth();
            }
        });
    }

    /**
     * Stealth Fallback retreat to Checkpoint 4 (35m)
     */
    startFallbackStealth() {
        this.currentAct = 2.8;
        this.currentStepIdx = 3;
        const cfg = this.faction === "west" ? MISSION_CONFIG.WEST : MISSION_CONFIG.OST;
        const cpFallback = cfg.CHECKPOINTS[3];
        GPSEngine.setTarget(cpFallback.lat, cpFallback.lon);

        this.addTerminalLog(`⚠️ ALARM: ZIELPERSON ANGESCHOSSEN! SOFORTIGER RÜCKZUG ZU PUNKT 4!`);
        this.saveCurrentProgress();

        StealthMinigame.start("terminal-mission-area", () => {
            this.startAct3();
        });
    }

    /**
     * AKT 3: Triage & Feindfunk / Russischer KGB-Kanal (60m Mulde)
     */
    startAct3() {
        this.currentAct = 3;
        StealthMinigame.stop();

        this.addTerminalLog(`AKT 3: DECKUNGSERDWALL ERREICHT. NOTFALL-TRIAGE & ABHÖRFUNK.`);
        this.saveCurrentProgress();

        // Geiger Counter activates automatically
        GeigerCounter.start();

        const area = document.getElementById("terminal-mission-area");
        area.innerHTML = `
            <div class="act-card">
                <div class="act-title">AKT 3: NOTFALLVERSORGUNG & ABHÖRFUNK</div>
                <div class="act-desc">
                    Die Zielperson liegt mit Beinschuss im Schilf. Der Geigerzähler ortet den Wismut-Isotopen-Koffer.
                </div>
                <div id="triage-container"></div>
            </div>
        `;

        TriageMinigame.start("triage-container", () => {
            this.solvedSteps.triageCode = "SOS";
            this.startRadioPhase();
        });
    }

    startRadioPhase() {
        const area = document.getElementById("terminal-mission-area");
        const targetFreq = this.faction === "west" ? MISSION_CONFIG.SOLUTIONS.RADIO_FREQ_WEST : MISSION_CONFIG.SOLUTIONS.RADIO_FREQ_OST;

        area.innerHTML = `
            <div class="act-card">
                <div class="act-title">FEINDFUNK & SOWJET-ABHÖRUNG (RADIO-TUNER)</div>
                <div class="act-desc">
                    Stellen Sie die Frequenz auf ${targetFreq} kHz (oder 474 kHz für den KGB-Sender) ein, um den abgefangenen Funkspruch zu entschlüsseln.
                </div>
                <div id="radio-container"></div>
            </div>
        `;

        RadioTuner.init("radio-container", targetFreq, (freq) => {
            this.solvedSteps.radioFreq = String(freq);
            RadioTuner.cleanup();
            this.startKGBIntervention();
        });
    }

    /**
     * Soviet KGB Major Woronin Dispatch in Russian
     */
    startKGBIntervention() {
        PhoneSimulator.triggerCall({
            name: "Major Igor Woronin",
            org: "KGB Sonderabteilung Karlshorst",
            img: "assets/img/person_woronin.png",
            audioFile: "assets/audio/kgb_woronin.mp3",
            transcript: "„Говорит майор Воронин, особый отдел Карлсхорст! Внимание! Товарищ Шенк, если этот физик попадет к империалистам, я лично отправлю вас в Сибирь! Приказ сорок девять: немедленно ликвидировать предателя! Выполнять приказ!“ [UNTERTITEL: Sofortige Liquidierung des Verräters befohlen!]",
            onComplete: () => {
                this.startAct4();
            }
        });
    }

    /**
     * AKT 4: Taktische Verzweigung (Subtil vs. Direkt)
     */
    startAct4() {
        this.currentAct = 4;
        GeigerCounter.stop();

        this.addTerminalLog(`AKT 4: ENTSCHEIDUNG ÜBER DIE ÜBERGABEMETHODE.`);
        this.saveCurrentProgress();

        const area = document.getElementById("terminal-mission-area");
        area.innerHTML = `
            <div class="act-card">
                <div class="act-title">AKT 4: DIE TAKTISCHE VERZWEIGUNG</div>
                <div class="act-desc">
                    Wie soll die Übergabe der verletzten Zielperson an der Demarkationslinie gerettet werden?
                </div>
                <div class="branch-choice-grid">
                    <button id="btn-branch-subtil" class="btn-branch-card">
                        <div class="branch-icon">🤫</div>
                        <div class="branch-name">OPTION A: SUBTILE ÜBERGABE</div>
                        <div class="branch-sub">Lautloser Austausch durch das alte Bachrohr im toten Winkel. Entschlüsselung über Morse-Flüsterer.</div>
                    </button>
                    <button id="btn-branch-direkt" class="btn-branch-card">
                        <div class="branch-icon">💥</div>
                        <div class="branch-name">OPTION B: DIREKTE ÜBERGABE</div>
                        <div class="branch-sub">Nebelgranaten zünden & Sturm-Austausch unter tickendem 60-Sekunden-Countdown am Hauptgrenzstein!</div>
                    </button>
                </div>
            </div>
        `;

        document.getElementById("btn-branch-subtil").onclick = () => {
            this.branchChoice = "subtil";
            this.startAct5();
        };
        document.getElementById("btn-branch-direkt").onclick = () => {
            this.branchChoice = "direkt";
            this.startAct5();
        };
    }

    /**
     * AKT 5: Das Finale & Enttarnung des Heckenschützen
     */
    startAct5() {
        this.currentAct = 5;
        const cfg = this.faction === "west" ? MISSION_CONFIG.WEST : MISSION_CONFIG.OST;
        const cpFinal = cfg.CHECKPOINTS[4];
        GPSEngine.setTarget(cpFinal.lat, cpFinal.lon);

        this.addTerminalLog(`AKT 5: DEMARKATIONSLINIE ERREICHT [${this.branchChoice.toUpperCase()}]. ENTTARNUNG DES MAULWURFS.`);
        this.saveCurrentProgress();

        const area = document.getElementById("terminal-mission-area");
        area.innerHTML = `
            <div class="act-card">
                <div class="act-title">AKT 5: FINALE & IDENTIFIZIERUNG DES SCHÜTZEN</div>
                <div class="act-desc">
                    ${this.branchChoice === 'direkt' ? '⏱️ ADRENALIN-MODUS AKTIV: 60 SEKUNDEN BIS ZUR ÜBERGABE!' : '🤫 LAUTLOSER SCHATTENTAUSCH IM GRENZGRABEN.'}
                    Wer hat den Schuss auf die Zielperson abgefeuert? Nutzen Sie das Dossier und die Ballistik.
                </div>
                <div class="mole-selection-grid">
                    <button class="btn-mole-opt" data-name="RICHTER">
                        <b>HAUPTMANN RICHTER</b> (NVA Scharfschütze, Kaliber 7.62mm)
                    </button>
                    <button class="btn-mole-opt" data-name="BERGER">
                        <b>UNTERLEUTNANT BERGER</b> (Funker Leitstelle)
                    </button>
                    <button class="btn-mole-opt" data-name="ELSTER">
                        <b>KLAUS-DIETER BEHRENDT</b> (Kundschafter)
                    </button>
                </div>
                <div id="final-crypto-result" style="margin-top: 20px;"></div>
            </div>
        `;

        area.querySelectorAll(".btn-mole-opt").forEach(btn => {
            btn.onclick = () => {
                this.executeFinalDecryption(btn.dataset.name);
            };
        });
    }

    /**
     * Execute AES-256 Decryption with mission solution parameters
     */
    async executeFinalDecryption(selectedMole) {
        this.solvedSteps.moleName = selectedMole;

        const isCorrectMole = (selectedMole === MISSION_CONFIG.SOLUTIONS.TRUE_MOLE);
        const resultContainer = document.getElementById("final-crypto-result");

        if (!isCorrectMole) {
            this.showInGameModal("FEHLURTEIL", "Falsche Person beschuldigt! Die Ballistik und Alibis stimmen nicht überein. Überprüfen Sie das Dossier!", "ERNEUT PRÜFEN");
            return;
        }

        // Derive AES-256 Key
        const key = await CryptoEngine.deriveKey(
            this.solvedSteps.startCode,
            this.solvedSteps.triageCode,
            this.solvedSteps.radioFreq,
            selectedMole,
            this.faction.toUpperCase()
        );

        const encPayload = this.faction === "west" ? MISSION_CONFIG.WEST.ENCRYPTED_FINAL : MISSION_CONFIG.OST.ENCRYPTED_FINAL;
        const decryptedCoords = await CryptoEngine.decrypt(encPayload, key);

        if (decryptedCoords) {
            AudioEngine.play("assets/audio/morse_beacon.wav", 1.0, false);
            AudioEngine.vibrate([100, 100, 200, 200, 500]);
            if (window.MobileUX) {
                window.MobileUX.clearSavedProgress();
                window.MobileUX.vibrate([150, 100, 150, 100, 300]);
            }

            resultContainer.innerHTML = `
                <div class="final-success-box">
                    <div class="final-badge">🎉 MISSION ERFOLGREICH VOLLZOGEN!</div>
                    <div class="final-sub">KRYPTOGRAFISCHE FREIGABE ERTEILT (AES-256 ENTSCHLÜSSELT)</div>
                    
                    <div class="coords-display-box">
                        <div class="coords-label">📍 FINALE KOORDINATEN DER DOSE:</div>
                        <div class="coords-text">${decryptedCoords}</div>
                    </div>

                    <div class="final-actions" style="display: flex; flex-direction: column; gap: 8px;">
                        <button id="btn-copy-coords" class="btn-terminal-action primary" onclick="GameEngine.copyFinalCoords('${decryptedCoords.replace(/'/g, "\\'")}')">
                            📋 KOORDINATEN KOPIEREN (C:GEO / GPS-APP)
                        </button>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(decryptedCoords.split('(')[0].trim())}" target="_blank" class="btn-terminal-action">
                            🗺️ IN GOOGLE MAPS ÖFFNEN
                        </a>
                        <button onclick="window.print()" class="btn-terminal-action">
                            🖨️ EINSATZ-DIPLOM DRUCKEN
                        </button>
                    </div>
                    <div id="copy-feedback-msg" style="margin-top: 10px; font-size: 12px; font-weight: bold; color: #4caf50; display: none; text-align: center;">
                        ✅ Koordinaten kopiert! Bereit zum Einfügen in c:geo oder Karten-App.
                    </div>

                    <div class="versteckules-credit">
                        Spionage-Thriller konzipiert und realisiert von <b>Versteckules</b>.
                    </div>
                </div>
            `;
        } else {
            this.showInGameModal("KRYPTO-FEHLER", "Entschlüsselung fehlgeschlagen. Die Parameter der Mission sind unvollständig.", "ZURÜCK");
        }
    }

    copyFinalCoords(coordText) {
        if (window.MobileUX) window.MobileUX.vibrate(35);
        const clean = coordText.split('(')[0].trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(clean).then(() => {
                const msg = document.getElementById("copy-feedback-msg");
                if (msg) {
                    msg.style.display = "block";
                    setTimeout(() => { if (msg) msg.style.display = "none"; }, 4000);
                }
            }).catch(() => {
                prompt("Finale Koordinaten:", clean);
            });
        } else {
            prompt("Finale Koordinaten:", clean);
        }
    }

    /**
     * Handle Tab switching
     */
    bindTabs() {
        const tabs = document.querySelectorAll(".menu-tab-btn");
        tabs.forEach(btn => {
            btn.onclick = () => {
                this.switchTab(btn.dataset.tab);
            };
        });
    }

    switchTab(tabName) {
        document.querySelectorAll(".menu-tab-btn").forEach(b => {
            b.classList.toggle("active", b.dataset.tab === tabName);
        });
        document.querySelectorAll(".tab-view-panel").forEach(p => {
            p.classList.toggle("active", p.id === `tab-${tabName}`);
        });

        if (tabName === "dossiers") {
            this.renderDossiers();
        } else if (tabName === "map") {
            if (window.MapEngine) {
                window.MapEngine.onTabVisible();
            }
        }
    }

    renderDossiers() {
        const container = document.getElementById("dossiers-list");
        if (!container) return;

        container.innerHTML = MISSION_CONFIG.PERSONS.map(p => `
            <div class="dossier-card ${this.isNVGActive ? 'nvg-mode' : ''}">
                <img src="${p.img}" alt="${p.name}" class="dossier-polaroid" />
                <div class="dossier-body">
                    <div class="dossier-name">${p.name}</div>
                    <div class="dossier-rank">${p.rank} • ${p.org}</div>
                    <div class="dossier-role">${p.role}</div>
                    <div class="dossier-desc">${p.desc}</div>
                    ${this.isNVGActive && p.isGuilty ? '<div class="nvg-clue">👁️ UV-RELAIS: Kaliber 7.62x39mm am Anschlagspunkt sichergestellt!</div>' : ''}
                </div>
            </div>
        `).join("");
    }

    toggleNVG() {
        this.isNVGActive = !this.isNVGActive;
        document.body.classList.toggle("nvg-active", this.isNVGActive);
        this.renderDossiers();
    }

    /**
     * GPS Callbacks
     */
    onGPSUpdate(loc) {
        if (window.MobileUX) {
            window.MobileUX.updateGPSAccuracy(loc.accuracy);
            window.MobileUX.setTargetBearing(loc.bearing);
        }
        const distEl = document.getElementById("radar-live-dist");
        if (distEl && loc.dist !== null) {
            distEl.textContent = `${loc.dist} m`;
        }
        const act2DistEl = document.getElementById("act2-live-dist");
        if (act2DistEl && loc.dist !== null) {
            act2DistEl.textContent = `${loc.dist} m`;
        }
        const needle = document.getElementById("radar-compass-needle");
        if (needle) {
            needle.style.transform = `rotate(${loc.bearing}deg)`;
        }
        MapEngine.updatePlayerPosition(loc.lat, loc.lon);
        GeigerCounter.setDistance(loc.dist || 100);
    }

    onZoneEntered(dist) {
        if (window.MobileUX) {
            window.MobileUX.vibrate([100, 50, 100]);
        }
        if (this.currentAct === 2 && this.currentStepIdx === 1) {
            // Reached Checkpoint 2 (Wegbiegung, 45m). Now advance to Checkpoint 3 (Gefahrenzone, 85m)
            this.currentStepIdx = 2;
            const cfg = this.faction === "west" ? MISSION_CONFIG.WEST : MISSION_CONFIG.OST;
            const cp3 = cfg.CHECKPOINTS[2];
            GPSEngine.setTarget(cp3.lat, cp3.lon);

            this.addTerminalLog(`BIEGUNG ERREICHT [45m]: Sichtkontakt zum Grenzgraben! Rücken Sie vor zu Punkt 3 (85m - Übergabestelle).`);
            const area = document.getElementById("terminal-mission-area");
            if (area) {
                area.innerHTML = `
                    <div class="act-card">
                        <div class="act-title">AKT 2: WEGBIEGUNG PASSIERT • VORRÜCKEN ZU PUNKT 3 [85m]</div>
                        <div class="act-desc">
                            Sichtkontakt zur Zielperson im Schilf hergestellt! Bewegen Sie sich vorsichtig weiter zur Demarkationslinie (Punkt 3).
                        </div>
                        <div class="radar-status-live">
                            DISTANZ ZUR ÜBERGABESTELLE: <span id="act2-live-dist" class="highlight">-- m</span>
                        </div>
                        <button class="btn-terminal-action primary" style="margin-top: 10px; width: 100%;" onclick="GameEngine.triggerIncident()">
                            ⚡ AN ÜBERGABEPUNKT VORSTOSSEN (ZWISCHENFALL AUSLÖSEN)
                        </button>
                    </div>
                `;
            }
        } else if (this.currentAct === 2 && this.currentStepIdx === 2) {
            // Reached Checkpoint 3 (Gefahrenzone, 85m) -> Trigger incident!
            this.triggerIncident();
        } else if (this.currentAct === 2.8 && this.currentStepIdx === 3) {
            this.startAct3();
        }
    }

    /**
     * Mobile State Persistence (Speichert Fortschritt für den Außeneinsatz)
     */
    saveCurrentProgress() {
        if (window.MobileUX) {
            window.MobileUX.saveProgress({
                faction: this.faction,
                currentAct: this.currentAct,
                currentStepIdx: this.currentStepIdx,
                branchChoice: this.branchChoice,
                solvedSteps: this.solvedSteps
            });
        }
    }

    checkSavedMissionResume() {
        if (!window.MobileUX) return;
        const saved = window.MobileUX.getSavedProgress();
        if (saved && saved.currentAct > 0) {
            const factionName = saved.faction === "west" ? "WEST (Bayern / BND)" : "OST (Sachsen / MfS)";
            setTimeout(() => {
                let modal = document.getElementById("in-game-modal");
                if (!modal) {
                    modal = document.createElement("div");
                    modal.id = "in-game-modal";
                    modal.className = "in-game-modal-backdrop";
                    document.body.appendChild(modal);
                }

                modal.innerHTML = `
                    <div class="terminal-modal-box">
                        <div class="modal-header">
                            <span class="modal-icon">💾</span>
                            <span class="modal-title">LAGEBERICHT WIEDERHERSTELLEN?</span>
                        </div>
                        <div class="modal-body">
                            Eine laufende Feldmission (<b>${factionName}</b>, Akt ${saved.currentAct}) wurde im Speicher gefunden. Möchten Sie direkt an dieser Position fortfahren oder neu beginnen?
                        </div>
                        <div class="modal-footer" style="display: flex; gap: 8px; justify-content: flex-end; width: 100%;">
                            <button id="btn-modal-discard" class="btn-terminal-action">NEUSTART</button>
                            <button id="btn-modal-resume" class="btn-terminal-action primary">FORTSETZEN</button>
                        </div>
                    </div>
                `;
                modal.style.display = "flex";

                document.getElementById("btn-modal-discard").onclick = () => {
                    modal.style.display = "none";
                    if (window.MobileUX) window.MobileUX.clearSavedProgress();
                };
                document.getElementById("btn-modal-resume").onclick = () => {
                    modal.style.display = "none";
                    this.resumeMission(saved);
                };
            }, 600);
        }
    }

    resumeMission(saved) {
        this.faction = saved.faction;
        window.CurrentFaction = saved.faction;
        this.solvedSteps = saved.solvedSteps || this.solvedSteps;
        this.branchChoice = saved.branchChoice;

        const cfg = this.faction === "west" ? MISSION_CONFIG.WEST : MISSION_CONFIG.OST;
        document.body.className = `theme-${cfg.THEME}`;
        document.getElementById("hud-faction-title").textContent = cfg.NAME;
        document.getElementById("cover-screen").style.display = "none";
        document.getElementById("app-main").style.display = "flex";

        MapEngine.loadFactionPath(cfg.CHECKPOINTS);
        GPSEngine.setPathWaypoints(cfg.CHECKPOINTS);
        EventsEngine.start();

        if (saved.currentAct >= 5) {
            this.startAct5();
        } else if (saved.currentAct >= 4) {
            this.startAct4();
        } else if (saved.currentAct >= 3) {
            this.startAct3();
        } else if (saved.currentAct >= 2) {
            this.startAct2();
        } else {
            this.startAct1();
        }
    }

    onOffPathWarning(isOff, dist) {
        const warnBanner = document.getElementById("off-path-warning-banner");
        if (warnBanner) {
            warnBanner.style.display = isOff ? "block" : "none";
            if (isOff) {
                AudioEngine.vibrate([100, 50, 100]);
            }
        }
    }

    addTerminalLog(text) {
        const logBox = document.getElementById("terminal-sys-log");
        if (!logBox) return;
        const entry = document.createElement("div");
        entry.className = "log-line";
        entry.innerHTML = `<span class="time">[${new Date().toLocaleTimeString()}]</span> ${text}`;
        logBox.appendChild(entry);
        logBox.scrollTop = logBox.scrollHeight;
    }

    handleCommand(cmd) {
        const c = cmd.trim();
        if (TestUserSimulator.checkInput(c)) {
            return;
        }
        if (c.toUpperCase() === "RESET") {
            this.promptReset();
            return;
        }
        if (c.toUpperCase() === "BRIEFING" || c.toUpperCase() === "INFO") {
            this.openBriefingModal();
            return;
        }
        this.addTerminalLog(`> ${c}: Unbekannter Befehl oder Code. Bitte Anweisung der Station beachten.`);
    }

    showInGameModal(title, msg, btnText = "OK") {
        let modal = document.getElementById("in-game-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "in-game-modal";
            modal.className = "in-game-modal-backdrop";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="terminal-modal-box">
                <div class="modal-header">
                    <span class="modal-icon">⚠️</span>
                    <span class="modal-title">${title}</span>
                </div>
                <div class="modal-body">${msg}</div>
                <div class="modal-footer">
                    <button id="btn-close-modal" class="btn-terminal-action primary">${btnText}</button>
                </div>
            </div>
        `;
        modal.style.display = "flex";

        document.getElementById("btn-close-modal").onclick = () => {
            modal.style.display = "none";
        };
    }

    showScreen(id) {
        document.getElementById("cover-screen").style.display = (id === "cover-screen") ? "flex" : "none";
        document.getElementById("app-main").style.display = (id === "app-main") ? "flex" : "none";
    }
}

const GameEngine = new GameEngineClass();
window.GameEngine = GameEngine;
document.addEventListener("DOMContentLoaded", () => window.GameEngine.init());
