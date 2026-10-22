/**
 * Suchscheinwerfer-Radar & Stealth-Minispiel für "Operation Schattentausch"
 * - NVA-Scheinwerfer tasten das Rückzugsgebiet ab
 * - Phasen: "Bewegen erlaubt" (Schatten) vs. "Stillstehen!" (Lichtkegel)
 * - Bei Erfassung: Sirenen & 45 Sekunden Lockdown-Strafe
 */

class StealthMinigameClass {
    constructor() {
        this.isActive = false;
        this.isSpotlightOn = false;
        this.lockdownTimeLeft = 0;
        this.lockdownInterval = null;
        this.phaseInterval = null;
        this.onEscaped = null;
        this.container = null;
    }

    start(containerId, onEscapedCallback) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.onEscaped = onEscapedCallback;
        this.isActive = true;

        this.render();
        this.startSearchlightCycle();
    }

    render() {
        this.container.innerHTML = `
            <div class="stealth-unit" id="stealth-unit">
                <div class="stealth-header">
                    <span class="warning-icon blink-fast">⚠️</span>
                    <span>ALARMSTUFE ROT: SUCHSCHEINWERFER AKTIV</span>
                </div>

                <div class="radar-sweep-screen" id="searchlight-screen">
                    <div class="searchlight-beam" id="searchlight-beam"></div>
                    <div class="radar-center-cross"></div>
                    <div class="stealth-status-banner" id="stealth-status-banner">
                        🟢 SCHATTENZONE: BEWEGUNG ERLAUBT (VORWÄRTS ZUR DECKUNG)
                    </div>
                </div>

                <div class="lockdown-overlay" id="lockdown-overlay" style="display: none;">
                    <div class="lockdown-title">🚨 ALARM! VOM SCHEINWERFER ERFASST! 🚨</div>
                    <div class="lockdown-timer" id="lockdown-timer">45</div>
                    <div class="lockdown-sub">TERMINAL GESPERRT - VERHARREN SIE IN DECKUNG!</div>
                    <button type="button" id="btn-skip-penalty" class="btn-terminal-action" style="margin-top: 12px; font-size: 11px; display: none;" onclick="StealthMinigame.skipPenalty()">
                        ⏩ STRAFZEIT ÜBERSPRINGEN (TEST)
                    </button>
                </div>

                <div class="stealth-instructions">
                    Beachten Sie die Lichtphasen! Bewegen Sie sich nur bei grüner Anzeige. Bleiben Sie bei rotem Lichtkegel absolut stillstehen.
                </div>

                <button type="button" id="btn-stealth-reach" class="btn-terminal-action primary" style="margin-top: 14px; width: 100%;">
                    🏃 DECKUNGSERDWALL ERREICHT [AKT 3 STARTEN]
                </button>
            </div>
        `;

        const reachBtn = document.getElementById("btn-stealth-reach");
        if (reachBtn) {
            reachBtn.onclick = () => this.escapeToCover();
        }
    }

    escapeToCover() {
        if (window.MobileUX) window.MobileUX.vibrate([100, 50, 100]);
        this.stop();
        if (this.onEscaped) this.onEscaped();
    }

    skipPenalty() {
        this.lockdownTimeLeft = 0;
        const overlay = document.getElementById("lockdown-overlay");
        if (overlay) overlay.style.display = "none";
        this.isSpotlightOn = false;
        if (this.lockdownInterval) clearInterval(this.lockdownInterval);
        this.startSearchlightCycle();
    }

    startSearchlightCycle() {
        let isLight = false;
        const cycle = () => {
            if (!this.isActive || this.lockdownTimeLeft > 0) return;

            isLight = !isLight;
            this.isSpotlightOn = isLight;
            const banner = document.getElementById("stealth-status-banner");
            const beam = document.getElementById("searchlight-beam");

            if (isLight) {
                // Spotlight sweeping: 4 seconds
                if (banner) {
                    banner.className = "stealth-status-banner alert blink-fast";
                    banner.innerHTML = "🔴 STILLSTEHEN! SCHEINWERFER ERFASST DAS GELÄNDE!";
                }
                if (beam) beam.className = "searchlight-beam active";
                if (window.AudioEngine) window.AudioEngine.vibrate([150]);
                this.phaseInterval = setTimeout(cycle, 4000);
            } else {
                // Shadow phase: 5.5 seconds
                if (banner) {
                    banner.className = "stealth-status-banner safe";
                    banner.innerHTML = "🟢 SCHATTENZONE: BEWEGUNG ERLAUBT (ZURÜCK ZUR MULDE)";
                }
                if (beam) beam.className = "searchlight-beam";
                this.phaseInterval = setTimeout(cycle, 5500);
            }
        };

        cycle();
    }

    /**
     * Trigger 45-second penalty if caught
     */
    triggerPenalty() {
        if (this.lockdownTimeLeft > 0) return;
        this.lockdownTimeLeft = 45;
        this.isSpotlightOn = true;

        if (window.AudioEngine) {
            window.AudioEngine.play("assets/audio/sirens_dogs.wav", 1.0, false);
            window.AudioEngine.vibrate([300, 100, 300, 100, 600]);
        }

        const overlay = document.getElementById("lockdown-overlay");
        const timerDisplay = document.getElementById("lockdown-timer");
        const skipBtn = document.getElementById("btn-skip-penalty");
        if (skipBtn && window.TestUserSimulator && window.TestUserSimulator.isActive) {
            skipBtn.style.display = "inline-flex";
        }
        if (overlay) overlay.style.display = "flex";

        if (this.lockdownInterval) clearInterval(this.lockdownInterval);
        this.lockdownInterval = setInterval(() => {
            this.lockdownTimeLeft--;
            if (timerDisplay) timerDisplay.textContent = this.lockdownTimeLeft;

            if (this.lockdownTimeLeft <= 0) {
                clearInterval(this.lockdownInterval);
                if (overlay) overlay.style.display = "none";
                this.isSpotlightOn = false;
                this.startSearchlightCycle();
            }
        }, 1000);
    }

    stop() {
        this.isActive = false;
        if (this.phaseInterval) clearTimeout(this.phaseInterval);
        if (this.lockdownInterval) clearInterval(this.lockdownInterval);
    }
}

const StealthMinigame = new StealthMinigameClass();
window.StealthMinigame = StealthMinigame;
