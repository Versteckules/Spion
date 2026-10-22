/**
 * Testuser-Modul für Geocache "Operation Schattentausch"
 * - Freigeschaltet durch Eingabe von 'OFFLINETEST', 'TEST' oder 1-Klick-Button
 * - Blendet eine interaktive Simulations-Leiste am oberen Bildschirmrand ein
 * - Erlaubt 1-Klick-Sofa-Tests aller Wegpunkte, Minispiele (Stealth, Triage, Radio, Anrufe) und Krypto-Funktionen
 */

class TestUserSimulatorClass {
    constructor() {
        this.isActive = false;
        this.barElement = null;
        this.keyBuffer = "";

        // Global key sequence listener (typing OFFLINETEST anywhere, even in inputs)
        window.addEventListener("keydown", (e) => {
            if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
                const val = (e.target.value || "") + (e.key.length === 1 ? e.key : "");
                if (val.toUpperCase().includes("OFFLINETEST") || val.toUpperCase().trim() === "TEST") {
                    this.activate();
                }
                return;
            }
            this.keyBuffer += e.key.toUpperCase();
            if (this.keyBuffer.length > 20) this.keyBuffer = this.keyBuffer.slice(-20);
            if (this.keyBuffer.includes("OFFLINETEST") || this.keyBuffer.includes("SOFATEST")) {
                this.activate();
                this.keyBuffer = "";
            }
        });

        // Live input check on the callsign field
        document.addEventListener("DOMContentLoaded", () => {
            const nameInput = document.getElementById("agent-callsign-input");
            if (nameInput) {
                nameInput.addEventListener("input", () => {
                    const v = nameInput.value.trim().toUpperCase();
                    if (v.includes("OFFLINETEST") || v === "TEST" || v === "SOFA") {
                        this.activate();
                    }
                });
            }
        });

        // URL Parameter check (?test=1 or ?offline=1)
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get("test") === "1" || params.get("offline") === "1" || params.get("mode") === "offline") {
                setTimeout(() => this.activate(), 200);
            }
        } catch(e) {}
    }

    /**
     * Check if entered string matches OFFLINETEST or TEST
     */
    checkInput(inputString) {
        if (!inputString) return false;
        const clean = inputString.trim().toUpperCase();
        if (clean === "OFFLINETEST" || clean === "TEST" || clean === "SOFA" || clean.includes("OFFLINETEST")) {
            this.activate();
            return true;
        }
        return false;
    }

    /**
     * Activate sofa simulation mode
     */
    activate() {
        if (this.isActive) return;
        this.isActive = true;
        document.body.classList.add("testbar-active");

        console.log("✅ OFFLINETEST-Modus aktiviert: GPS-Zwang aufgehoben, Simulations-Leiste aktiv.");

        // If player is still on cover screen, automatically initialize into Act 1
        if (window.GameEngine) {
            const cover = document.getElementById("cover-screen");
            if (cover && cover.style.display !== "none") {
                window.GameEngine.playerName = window.GameEngine.playerName || "TestAgent";
                window.GameEngine.faction = window.GameEngine.faction || "west";
                window.GameEngine.startConfirmedMission();
            }
        }

        this.renderBar();

        if (window.GameEngine && window.GameEngine.showInGameModal) {
            window.GameEngine.showInGameModal(
                "TESTUSER FREIGESCHALTET",
                "Der OFFLINETEST-Modus ist aktiv! Klicke in der oberen Leiste auf ein beliebiges Minispiel (💥 Schuss, 🚨 Stealth, ✚ Triage, 📻 Radio, 🎯 Finale), um es sofort auf dem Bildschirm zu starten.",
                "SPIELE TESTEN ▶"
            );
        }
    }

    renderBar() {
        document.body.classList.add("testbar-active");

        if (!this.barElement) {
            this.barElement = document.createElement("div");
            this.barElement.id = "testuser-bar";
            this.barElement.className = "testuser-simulation-bar";
            document.body.prepend(this.barElement);
        }

        const faction = window.CurrentFaction || (window.GameEngine ? window.GameEngine.faction : "west");
        const checkpoints = faction === "west" ? MISSION_CONFIG.WEST.CHECKPOINTS : MISSION_CONFIG.OST.CHECKPOINTS;

        this.barElement.innerHTML = `
            <div class="testbar-inner">
                <span class="testbar-label">🛠️ OFFLINE-TEST [${faction.toUpperCase()}]:</span>
                <div class="testbar-buttons">
                    <button class="btn-test-wp" data-action="act1" title="Station 1: Startpunkt & Code">
                        🔘 1. Start (1983)
                    </button>
                    <button class="btn-test-wp" data-action="act2" title="Station 2: Vorrücken (45m)">
                        📍 2. Vorrücken
                    </button>
                    <button class="btn-test-wp alert-wp" data-action="incident" title="Station 2.5: Schusswechsel & Dialekt-Notruf">
                        💥 3. Schuss & Notruf
                    </button>
                    <button class="btn-test-wp" data-action="stealth" title="Stealth: Suchscheinwerfer & NVA Radar">
                        🚨 Stealth-Radar
                    </button>
                    <button class="btn-test-wp" data-action="triage" title="Station 3: Triage-Lazarett & SOS Morsecode">
                        ✚ 4. Triage (SOS)
                    </button>
                    <button class="btn-test-wp" data-action="radio" title="Station 3b: Kurzwellen-Radio & KGB-Abhörung">
                        📻 Radio (KGB)
                    </button>
                    <button class="btn-test-wp" data-action="branch" title="Station 4: Fluchtplan-Wahl (Subtil vs. Direkt)">
                        ⚡ 5. Fluchtplan
                    </button>
                    <button class="btn-test-wp" data-action="final" title="Station 5: Finale, Heckenschütze & Krypto-Safe">
                        🎯 6. Finale (Safe)
                    </button>
                </div>
                <div class="testbar-events">
                    <button id="btn-test-patrol" class="btn-test-ev" title="Patrouille triggern">🚨 Streife</button>
                    <button id="btn-test-dog" class="btn-test-ev" title="Wachhund triggern">🐕 Hund</button>
                </div>
            </div>
        `;

        // Bind interactive direct-jump buttons
        this.barElement.querySelectorAll(".btn-test-wp").forEach(btn => {
            btn.onclick = () => {
                const action = btn.dataset.action;
                btn.classList.add("active");
                setTimeout(() => btn.classList.remove("active"), 800);

                if (!window.GameEngine) return;
                window.GameEngine.switchTab("terminal");

                const currentCheckpoints = (window.GameEngine.faction === "west" ? MISSION_CONFIG.WEST : MISSION_CONFIG.OST).CHECKPOINTS;

                if (action === "act1") {
                    const cp = currentCheckpoints[0];
                    if (window.GPSEngine) window.GPSEngine.simulateLocation(cp.lat, cp.lon, 2.5);
                    if (window.MapEngine) window.MapEngine.updatePlayerPosition(cp.lat, cp.lon);
                    window.GameEngine.startAct1();
                    const codeIn = document.getElementById("input-act1-code");
                    if (codeIn) codeIn.value = "1983";
                } else if (action === "act2") {
                    const cp = currentCheckpoints[1];
                    if (window.GPSEngine) window.GPSEngine.simulateLocation(cp.lat, cp.lon, 2.5);
                    if (window.MapEngine) window.MapEngine.updatePlayerPosition(cp.lat, cp.lon);
                    window.GameEngine.startAct2();
                } else if (action === "incident") {
                    const cp = currentCheckpoints[2];
                    if (window.GPSEngine) window.GPSEngine.simulateLocation(cp.lat, cp.lon, 2.5);
                    if (window.MapEngine) window.MapEngine.updatePlayerPosition(cp.lat, cp.lon);
                    window.GameEngine.triggerIncident();
                } else if (action === "stealth") {
                    const cp = currentCheckpoints[3];
                    if (window.GPSEngine) window.GPSEngine.simulateLocation(cp.lat, cp.lon, 2.5);
                    if (window.MapEngine) window.MapEngine.updatePlayerPosition(cp.lat, cp.lon);
                    window.GameEngine.startFallbackStealth();
                } else if (action === "triage") {
                    const cp = currentCheckpoints[3];
                    if (window.GPSEngine) window.GPSEngine.simulateLocation(cp.lat, cp.lon, 2.5);
                    if (window.MapEngine) window.MapEngine.updatePlayerPosition(cp.lat, cp.lon);
                    window.GameEngine.startAct3();
                } else if (action === "radio") {
                    window.GameEngine.startRadioPhase();
                } else if (action === "branch") {
                    window.GameEngine.startAct4();
                } else if (action === "final") {
                    const cp = currentCheckpoints[4];
                    if (window.GPSEngine) window.GPSEngine.simulateLocation(cp.lat, cp.lon, 2.5);
                    if (window.MapEngine) window.MapEngine.updatePlayerPosition(cp.lat, cp.lon);
                    window.GameEngine.branchChoice = window.GameEngine.branchChoice || "subtil";
                    window.GameEngine.startAct5();
                }
            };
        });

        // Bind event buttons
        const btnPatrol = document.getElementById("btn-test-patrol");
        if (btnPatrol) {
            btnPatrol.onclick = () => {
                if (window.EventsEngine) window.EventsEngine.triggerPatrol();
            };
        }
        const btnDog = document.getElementById("btn-test-dog");
        if (btnDog) {
            btnDog.onclick = () => {
                if (window.EventsEngine) window.EventsEngine.triggerDog();
            };
        }
    }
}

const TestUserSimulator = new TestUserSimulatorClass();
window.TestUserSimulator = TestUserSimulator;
