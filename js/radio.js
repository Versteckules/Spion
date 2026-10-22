/**
 * Kurzwellen-Radio & Zahlensender Minispiel für "Operation Schattentausch"
 * - Analoge Abstimmung 400 - 520 kHz
 * - Statisches Rauschen weicht bei korrekter Frequenz klarem Abhörfunk
 * - Sowjetischer Zahlensender auf 474 kHz
 */

class RadioTunerClass {
    constructor() {
        this.currentFreq = 420;
        this.targetFreq = 462;
        this.isPlaying = false;
        this.container = null;
        this.onFreqUnlocked = null;
        this.staticLoop = null;
    }

    /**
     * Mount radio into a target container
     */
    init(containerId, targetFreq, onUnlocked) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.targetFreq = parseInt(targetFreq, 10);
        this.onFreqUnlocked = onUnlocked;

        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="radio-unit">
                <div class="radio-header">
                    <span>KURZWELLEN-EMPFÄNGER K-5120</span>
                    <span class="freq-display" id="freq-num">${this.currentFreq}.0 kHz</span>
                </div>

                <div class="radio-scale-box">
                    <div class="freq-scale">
                        <span>400</span>
                        <span>420</span>
                        <span>440</span>
                        <span>460</span>
                        <span>480</span>
                        <span>500</span>
                        <span>520</span>
                    </div>
                    <div class="needle-track">
                        <div class="freq-needle" id="radio-needle" style="left: ${(this.currentFreq - 400) / 120 * 100}%"></div>
                    </div>
                </div>

                <div class="tuner-control-area">
                    <label class="tuner-label">ABSTIMM-REGLER DREHEN / FEINJUSTIERUNG:</label>
                    <input type="range" id="freq-slider" min="400" max="520" step="1" value="${this.currentFreq}" class="radio-slider" />
                    <div class="freq-stepper-row">
                        <button type="button" id="btn-freq-minus" class="btn-freq-step" onclick="RadioTuner.adjustFreq(-1)">◀ -1 kHz</button>
                        <span class="freq-step-hint">FEINABSTIMMUNG</span>
                        <button type="button" id="btn-freq-plus" class="btn-freq-step" onclick="RadioTuner.adjustFreq(+1)">+1 kHz ▶</button>
                    </div>
                </div>

                <div class="radio-status" id="radio-signal-status">
                    <span class="signal-indicator static">⚡ RAUSCHEN & STÖRFUNK</span>
                </div>

                <div class="radio-action-box" id="radio-action-box" style="display: none;">
                    <div class="radio-intel-msg" id="radio-intel-msg"></div>
                    <button id="btn-radio-replay" class="btn-terminal-action">
                        🔄 FUNK WIEDERHOLEN
                    </button>
                    <button id="btn-radio-confirm" class="btn-terminal-action primary">
                        ✅ FREQUENZ BESTÄTIGEN
                    </button>
                </div>
            </div>
        `;

        const slider = document.getElementById("freq-slider");
        slider.oninput = (e) => {
            this.setFrequency(parseInt(e.target.value, 10));
        };

        document.getElementById("btn-radio-confirm").onclick = () => {
            if (this.onFreqUnlocked) this.onFreqUnlocked(this.currentFreq);
        };

        // Start static noise
        AudioEngine.startLoop("static", "assets/audio/radio_static.wav", 0.4);
    }

    adjustFreq(delta) {
        const next = Math.max(400, Math.min(520, this.currentFreq + delta));
        const slider = document.getElementById("freq-slider");
        if (slider) slider.value = next;
        if (window.MobileUX) window.MobileUX.vibrate(15);
        this.setFrequency(next);
    }

    setFrequency(freq) {
        this.currentFreq = freq;
        document.getElementById("freq-num").textContent = `${freq}.0 kHz`;
        document.getElementById("radio-needle").style.left = `${(freq - 400) / 120 * 100}%`;

        const status = document.getElementById("radio-signal-status");
        const actionBox = document.getElementById("radio-action-box");
        const intelMsg = document.getElementById("radio-intel-msg");

        // Target Freq Match
        if (Math.abs(freq - this.targetFreq) <= 1) {
            status.innerHTML = `<span class="signal-indicator locked">🟢 SIGNAL GEKOPPELT (${freq} kHz)</span>`;
            actionBox.style.display = "block";
            intelMsg.textContent = `Verschlüsselter Feindfunk abgefangen! Hören Sie die Codewörter ab.`;

            // Play intercepted radio
            const side = window.CurrentFaction || "west";
            const sound = side === "west" ? "assets/audio/radio_saxon.mp3" : "assets/audio/radio_bavarian.mp3";
            AudioEngine.play(sound, 1.35, true);

            document.getElementById("btn-radio-replay").onclick = () => {
                AudioEngine.play(sound, 1.35, true);
            };

            AudioEngine.stopLoop("static");
        } else if (freq === 474) {
            // Russian Number Station Easter Egg
            status.innerHTML = `<span class="signal-indicator kgb">🔴 SOWJET-SENDER KARAKORUM (474 kHz)</span>`;
            actionBox.style.display = "block";
            intelMsg.textContent = `Russischer Zahlensender abgefangen: 'Внимание, говорит Центр! 7-0-3-1-9...'`;

            AudioEngine.play("assets/audio/russian_station.mp3", 1.0, true);

            document.getElementById("btn-radio-replay").onclick = () => {
                AudioEngine.play("assets/audio/russian_station.mp3", 1.0, true);
            };

            AudioEngine.stopLoop("static");
        } else {
            status.innerHTML = `<span class="signal-indicator static">⚡ RAUSCHEN & STÖRFUNK (${freq} kHz)</span>`;
            actionBox.style.display = "none";
            AudioEngine.startLoop("static", "assets/audio/radio_static.wav", 0.4);
        }
    }

    cleanup() {
        AudioEngine.stopLoop("static");
    }
}

const RadioTuner = new RadioTunerClass();
window.RadioTuner = RadioTuner;
