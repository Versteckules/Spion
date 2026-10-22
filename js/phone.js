/**
 * Notruf- & Telefon-Simulator für Geocache "Operation Schattentausch"
 * - 80er-Jahre Militärtelefon-Overlay mit Vibration & Klingelton
 * - Echte Dialekt-Sprachausgabe (+35% Sprechtempo)
 * - Zuschaltbare Funk-Untertitel
 * - Integrierte Replay-Taste
 */

class PhoneSimulatorClass {
    constructor() {
        this.overlay = null;
        this.callerName = "";
        this.callerOrg = "";
        this.callerImg = "";
        this.audioFile = "";
        this.transcript = "";
        this.onCallFinished = null;
        this.ringInterval = null;
    }

    /**
     * Trigger an incoming encrypted call
     */
    triggerCall({ name, org, img, audioFile, transcript, onComplete }) {
        this.callerName = name;
        this.callerOrg = org;
        this.callerImg = img;
        this.audioFile = audioFile;
        this.transcript = transcript;
        this.onCallFinished = onComplete;

        this.renderCallIncoming();
    }

    /**
     * Render the ringing screen
     */
    renderCallIncoming() {
        let container = document.getElementById("phone-modal-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "phone-modal-container";
            document.body.appendChild(container);
        }

        container.className = "phone-overlay visible ringing";
        container.innerHTML = `
            <div class="phone-crt-frame">
                <div class="phone-header">
                    <span class="beacon-dot blink-fast"></span>
                    <span class="phone-title">⚠️ EINGEHENDES VERSCHLÜSSELTES NOTRUFSIGNAL ⚠️</span>
                </div>
                
                <div class="caller-card">
                    <img src="${this.callerImg}" alt="${this.callerName}" class="caller-polaroid" />
                    <div class="caller-meta">
                        <div class="caller-rank-name">${this.callerName}</div>
                        <div class="caller-unit">${this.callerOrg}</div>
                        <div class="crypto-status">STATUS: KRYPTO-KANAL FREQUENZ 462 kHz</div>
                    </div>
                </div>

                <div class="call-action-area">
                    <button id="btn-accept-call" class="btn-terminal-call accept">
                        📞 ABHEBEN & KANAL ÖFFNEN
                    </button>
                </div>
            </div>
        `;

        // Ringing sound & vibration loop
        AudioEngine.vibrate([400, 200, 400, 200, 800]);
        this.ringInterval = setInterval(() => {
            AudioEngine.vibrate([400, 200, 400, 200, 800]);
        }, 2200);

        document.getElementById("btn-accept-call").onclick = () => {
            this.acceptCall(container);
        };
    }

    /**
     * Call accepted: play voice, show visualizer, subtitles and replay button
     */
    acceptCall(container) {
        clearInterval(this.ringInterval);
        container.className = "phone-overlay visible active-call";

        container.innerHTML = `
            <div class="phone-crt-frame">
                <div class="phone-header">
                    <span class="beacon-dot live"></span>
                    <span class="phone-title">🟢 LIVE-FUNKVERBINDUNG BESTEHT [PRIORITÄT 1]</span>
                </div>

                <div class="caller-card active">
                    <img src="${this.callerImg}" alt="${this.callerName}" class="caller-polaroid active" />
                    <div class="caller-meta">
                        <div class="caller-rank-name">${this.callerName}</div>
                        <div class="caller-unit">${this.callerOrg}</div>
                        <canvas id="call-oscilloscope" width="260" height="40" class="mini-oscilloscope"></canvas>
                    </div>
                </div>

                <div class="transcript-box" id="call-transcript-box">
                    <div class="transcript-header">FUNK-TRANSKRIPT (AUTOMATISCHE DECHIFFRIERUNG):</div>
                    <div class="transcript-text">${this.transcript}</div>
                </div>

                <div class="call-controls">
                    <button id="btn-replay-dispatch" class="btn-terminal-action">
                        🔄 FUNKSPRUCH WIEDERHOLEN / REPLAY
                    </button>
                    <button id="btn-end-call" class="btn-terminal-action primary">
                        ✅ BESTÄTIGEN & BEFEHL AUSFÜHREN
                    </button>
                </div>
            </div>
        `;

        // Play audio at 1.35x speed
        AudioEngine.play(this.audioFile, 1.35, true);

        // Hook up replay button
        document.getElementById("btn-replay-dispatch").onclick = () => {
            AudioEngine.play(this.audioFile, 1.35, true);
        };

        // Hook up end call button
        document.getElementById("btn-end-call").onclick = () => {
            if (AudioEngine.currentAudio) {
                AudioEngine.currentAudio.pause();
            }
            container.className = "phone-overlay hidden";
            container.style.display = "none";
            if (this.onCallFinished) this.onCallFinished();
        };

        // Render animated audio wave
        this.animateWaveform();
    }

    animateWaveform() {
        const canvas = document.getElementById("call-oscilloscope");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let step = 0;

        const draw = () => {
            if (!document.getElementById("call-oscilloscope")) return;
            ctx.fillStyle = "#0c150c";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#4caf50";
            ctx.beginPath();

            const sliceWidth = canvas.width / 30;
            let x = 0;

            for (let i = 0; i < 30; i++) {
                const v = Math.sin((i + step) * 0.4) * 12 * (Math.random() * 0.4 + 0.6);
                const y = canvas.height / 2 + v;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.stroke();
            step += 0.8;
            requestAnimationFrame(draw);
        };
        draw();
    }
}

const PhoneSimulator = new PhoneSimulatorClass();
window.PhoneSimulator = PhoneSimulator;
