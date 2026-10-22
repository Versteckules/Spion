/**
 * Audio Engine für Geocache "Operation Schattentausch"
 * - Web Audio API Analyser & Visualizer
 * - Dialekt-Playback (+35% Sprechtempo)
 * - Sound FX (Schuss, Sirenen, Herzschlag, Morse, Geigerzähler)
 * - Replay-Funktion für jeden Funkspruch
 */

class AudioEngineClass {
    constructor() {
        this.ctx = null;
        this.analyser = null;
        this.currentAudio = null;
        this.lastPlayedFile = null;
        this.lastPlayedSpeed = 1.0;
        this.ambientLoops = {};
        this.isUnlocked = false;
    }

    /**
     * Unlock AudioContext on mobile touch/click
     */
    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 64;
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isUnlocked = true;
    }

    /**
     * Play a sound file (MP3 or WAV)
     * @param {string} relativePath
     * @param {number} speed Multiplier (1.35 for fast dialect)
     * @param {boolean} isSpeech Whether this can be replayed
     * @param {boolean} loop
     * @param {number} volume Volume 0.0 to 1.0 (default 1.0)
     */
    play(relativePath, speed = 1.0, isSpeech = true, loop = false, volume = 1.0) {
        this.init();

        // Stop current speech if any
        if (isSpeech && this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }

        const audio = new Audio(relativePath);
        audio.playbackRate = speed;
        audio.loop = loop;
        audio.volume = Math.max(0, Math.min(1, volume));

        if (isSpeech) {
            this.currentAudio = audio;
            this.lastPlayedFile = relativePath;
            this.lastPlayedSpeed = speed;

            // Show quick replay button in HUD
            const replayBtn = document.getElementById("btn-quick-replay");
            if (replayBtn) {
                replayBtn.style.display = "inline-flex";
                replayBtn.classList.add("active");
            }

            audio.addEventListener('play', () => {
                document.dispatchEvent(new CustomEvent('speechStarted', { detail: { file: relativePath } }));
                if (replayBtn) replayBtn.classList.add("active");
            });
            audio.addEventListener('ended', () => {
                document.dispatchEvent(new CustomEvent('speechEnded', { detail: { file: relativePath } }));
                if (replayBtn) replayBtn.classList.remove("active");
            });
        }

        audio.play().catch(e => console.log("Audio play prevented:", e));
        return audio;
    }

    /**
     * Replay the last spoken dispatch
     */
    replayLast() {
        if (this.lastPlayedFile) {
            this.vibrate(25);
            this.play(this.lastPlayedFile, this.lastPlayedSpeed, true);
            return true;
        }
        return false;
    }

    /**
     * Haptic feedback vibration (delegates to MobileUX or navigator.vibrate)
     */
    vibrate(pattern = 50) {
        try {
            if (window.MobileUX && typeof window.MobileUX.vibrate === "function") {
                window.MobileUX.vibrate(pattern);
            } else if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
                navigator.vibrate(pattern);
            }
        } catch(e) {}
    }

    /**
     * Start ambient loop (e.g. radio static or sirens)
     */
    startLoop(name, path, volume = 0.5) {
        if (this.ambientLoops[name]) return;
        const a = new Audio(path);
        a.loop = true;
        a.volume = volume;
        a.play().catch(() => {});
        this.ambientLoops[name] = a;
    }

    /**
     * Stop ambient loop
     */
    stopLoop(name) {
        if (this.ambientLoops[name]) {
            this.ambientLoops[name].pause();
            this.ambientLoops[name].currentTime = 0;
            delete this.ambientLoops[name];
        }
    }

    /**
     * Stop all audio and speech synthesis
     */
    stopAll() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        for (let k in this.ambientLoops) {
            this.stopLoop(k);
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    /**
     * Read aloud text via SpeechSynthesis (German) - crystal clear voice without static hiss, brisk military pace (+20% faster)
     */
    speakText(text, options = {}, onStart = null, onEnd = null) {
        this.init();
        if (!('speechSynthesis' in window)) {
            console.warn("SpeechSynthesis not supported");
            if (onEnd) onEnd();
            return false;
        }

        window.speechSynthesis.cancel();

        // Zero noise during instruction reading: no static hiss or squelch
        if (options.radioClick === true) {
            const squelch = this.play("assets/audio/radio_static.wav", 2.0, false, false, 0.03);
            if (squelch) {
                setTimeout(() => {
                    try {
                        squelch.pause();
                        squelch.currentTime = 0;
                    } catch (e) {}
                }, 150);
            }
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "de-DE";
        // 20% faster speech pace for crisp, concise military delivery
        utterance.rate = options.rate || 1.25;
        utterance.pitch = options.pitch || 0.95;

        // Try to pick a natural German voice if available
        const voices = window.speechSynthesis.getVoices();
        const deVoice = voices.find(v => v.lang.startsWith("de") && !v.localService) || voices.find(v => v.lang.startsWith("de"));
        if (deVoice) utterance.voice = deVoice;

        utterance.onstart = () => {
            if (onStart) onStart();
        };

        utterance.onend = () => {
            if (onEnd) onEnd();
        };

        utterance.onerror = (e) => {
            console.warn("Speech error:", e);
            if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
        return true;
    }

    /**
     * Stop any active SpeechSynthesis
     */
    stopSpeech() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (this.currentAudio) {
            this.currentAudio.pause();
        }
    }

    /**
     * Trigger vibration pattern
     */
    vibrate(pattern = [400, 200, 400, 200, 800]) {
        if (navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {}
        }
    }
}

const AudioEngine = new AudioEngineClass();
window.AudioEngine = AudioEngine;
