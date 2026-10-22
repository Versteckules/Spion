/**
 * Triage & Morse-Code Minispiel für "Operation Schattentausch"
 * - Notfallversorgung der verletzten Zielperson im Grenzgraben
 * - Akustischer Morse-Code & Herzschlag-Biomonitor
 * - Eingabe des 3-stelligen Triage-Codes (SOS)
 */

class TriageMinigameClass {
    constructor() {
        this.container = null;
        this.onStabilized = null;
        this.currentInput = "";
    }

    start(containerId, onComplete) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.onStabilized = onComplete;
        this.currentInput = "";

        // Start heartbeat sound in background
        AudioEngine.startLoop("heartbeat", "assets/audio/heartbeat_loop.wav", 0.6);

        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="triage-unit">
                <div class="triage-header">
                    <span class="cross-icon">✚</span>
                    <span>FELDLAZARETT: TRIAGE DR. GÖRNER [ARTERIELLE BLUTUNG]</span>
                </div>

                <div class="biomonitor-box">
                    <div class="vital-item">
                        <span class="vital-label">PULS:</span>
                        <span class="vital-val blink">142 BPM</span>
                    </div>
                    <div class="vital-item">
                        <span class="vital-label">BLUTDRUCK:</span>
                        <span class="vital-val warn">80 / 45 mmHg</span>
                    </div>
                    <div class="vital-item">
                        <span class="vital-label">STATUS:</span>
                        <span class="vital-val crit">KRITISCH</span>
                    </div>
                </div>

                <div class="morse-clue-box">
                    <div class="morse-clue-title">AKUSTISCHER NOTFALL-CODE:</div>
                    <button id="btn-play-morse" class="btn-terminal-action">
                        🔊 MORSE-NOTSIGNAL ANHÖREN (• • • — — — • • •)
                    </button>
                    <div class="morse-help">Hören Sie den Rhythmus und dechiffrieren Sie den 3-Buchstaben-Code.</div>
                </div>

                <div class="triage-input-area">
                    <label class="input-label">3-STELLIGEN TRIAGE-CODE EINGEBEN:</label>
                    <div class="code-display" id="triage-code-display">_ _ _</div>
                    <div class="typepad-row">
                        <button class="btn-key" data-char="S">S</button>
                        <button class="btn-key" data-char="O">O</button>
                        <button class="btn-key" data-char="A">A</button>
                        <button class="btn-key" data-char="R">R</button>
                        <button class="btn-key" data-char="T">T</button>
                        <button class="btn-key clear" id="btn-clear-triage">DEL</button>
                    </div>
                    <button id="btn-submit-triage" class="btn-terminal-action primary" style="margin-top: 15px; width: 100%;">
                        💉 DRUCKVERBAND ANLEGEN & STABILISIEREN
                    </button>
                </div>

                <div class="triage-feedback" id="triage-feedback"></div>
            </div>
        `;

        document.getElementById("btn-play-morse").onclick = () => {
            AudioEngine.play("assets/audio/morse_beacon.wav", 1.0, false);
        };

        const display = document.getElementById("triage-code-display");
        const keys = this.container.querySelectorAll(".btn-key:not(.clear)");
        keys.forEach(k => {
            k.onclick = () => {
                if (window.MobileUX) window.MobileUX.vibrate(18);
                if (this.currentInput.length < 3) {
                    this.currentInput += k.dataset.char;
                    display.textContent = this.currentInput;
                }
            };
        });

        document.getElementById("btn-clear-triage").onclick = () => {
            if (window.MobileUX) window.MobileUX.vibrate(25);
            this.currentInput = "";
            display.textContent = "_ _ _";
            document.getElementById("triage-feedback").textContent = "";
        };

        document.getElementById("btn-submit-triage").onclick = () => {
            this.verify();
        };
    }

    verify() {
        const feedback = document.getElementById("triage-feedback");
        if (this.currentInput.toUpperCase() === "SOS") {
            feedback.className = "triage-feedback success";
            feedback.innerHTML = "✅ BLUTUNG ERFOLGREICH GESTILLT! ZIELPERSON TRANSPORTFÄHIG!";
            AudioEngine.stopLoop("heartbeat");
            AudioEngine.vibrate([100, 50, 100]);

            setTimeout(() => {
                if (this.onStabilized) this.onStabilized();
            }, 1800);
        } else {
            feedback.className = "triage-feedback error blink-fast";
            feedback.innerHTML = "❌ FALSCHER CODE! KREISLAUF KOLLABIERT! ERNEUT ABHÖREN!";
            AudioEngine.vibrate([300, 100, 300]);
            this.currentInput = "";
            document.getElementById("triage-code-display").textContent = "_ _ _";
        }
    }

    cleanup() {
        AudioEngine.stopLoop("heartbeat");
    }
}

const TriageMinigame = new TriageMinigameClass();
window.TriageMinigame = TriageMinigame;
