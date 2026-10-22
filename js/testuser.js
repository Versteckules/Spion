/**
 * Testuser-Modul für Geocache "Operation Schattentausch"
 * - Freigeschaltet durch Eingabe von 'OFFLINETEST', 'TEST' oder 1-Klick-Button
 * - Blendet eine Simulations-Leiste am oberen Bildschirmrand ein
 * - Erlaubt 1-Klick-Sofa-Tests aller Wegpunkte, Schusswechsel, Minispiele und Krypto-Funktionen
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
                "Der OFFLINETEST-Modus ist aktiv! Sie können nun über die Steuerleiste am oberen Bildschirmrand jeden Wegpunkt simulieren und alle Stationen ohne GPS durchspielen.",
                "VERSTANDEN"
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

        let buttonsHtml = checkpoints.map((cp, idx) => `
            <button class="btn-test-wp" data-lat="${cp.lat}" data-lon="${cp.lon}" data-idx="${idx}" title="${cp.name}">
                ${idx === 2 ? '💥' : (idx === 3 ? '↩️' : (idx === 4 ? '📍' : '🔘'))} P${idx + 1}: ${cp.name.split(' ')[0]}
            </button>
        `).join("");

        this.barElement.innerHTML = `
            <div class="testbar-inner">
                <span class="testbar-label">🛠️ OFFLINETEST [${faction.toUpperCase()}]:</span>
                <div class="testbar-buttons">
                    ${buttonsHtml}
                </div>
                <div class="testbar-events">
                    <button id="btn-test-patrol" class="btn-test-ev" title="Patrouille triggern">🚨 Streife</button>
                    <button id="btn-test-dog" class="btn-test-ev" title="Wachhund triggern">🐕 Hund</button>
                </div>
            </div>
        `;

        // Bind waypoint buttons
        this.barElement.querySelectorAll(".btn-test-wp").forEach(btn => {
            btn.onclick = () => {
                const lat = parseFloat(btn.dataset.lat);
                const lon = parseFloat(btn.dataset.lon);
                if (window.GPSEngine) {
                    window.GPSEngine.simulateLocation(lat, lon, 2.5);
                }
                if (window.MapEngine) {
                    window.MapEngine.updatePlayerPosition(lat, lon);
                }
                btn.classList.add("active");
                setTimeout(() => btn.classList.remove("active"), 1200);
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
