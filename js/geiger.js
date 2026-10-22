/**
 * Geigerzähler Sensor-Modul für Geocache "Operation Schattentausch"
 * - Erzeugt dynamisches Knatter-Audio je nach Restdistanz zur Zielperson
 * - Haptische Impulse via navigator.vibrate
 * - Animierte Zeigeranzeige (μSv/h)
 */

class GeigerCounterClass {
    constructor() {
        this.isActive = false;
        this.intervalId = null;
        this.currentDistance = 100;
    }

    /**
     * Start Geiger counter based on distance
     */
    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.tick();
    }

    /**
     * Stop Geiger counter
     */
    stop() {
        this.isActive = false;
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Update distance to target person (Wismut isotope container)
     */
    setDistance(meters) {
        this.currentDistance = Math.max(2, meters);
        if (meters <= 45 && !this.isActive) {
            this.start();
        } else if (meters > 55 && this.isActive) {
            this.stop();
        }
    }

    /**
     * Recursive procedural tick based on distance
     */
    tick() {
        if (!this.isActive) return;

        // Rate increases as distance decreases
        // 45m -> ~600ms delay, 5m -> ~45ms delay
        const delay = Math.max(35, Math.min(800, Math.pow(this.currentDistance / 45, 1.8) * 600 + (Math.random() * 80 - 40)));

        // Audio crackle pulse
        AudioEngine.play("assets/audio/geiger_crackle.wav", 1.0, false);

        // Haptic micro-pulse
        if (this.currentDistance < 15) {
            AudioEngine.vibrate([25]);
        }

        // Update UI Needle if present
        const needle = document.getElementById("geiger-needle");
        const valDisplay = document.getElementById("geiger-val");
        if (needle) {
            const angle = Math.min(65, Math.max(-65, (45 - this.currentDistance) / 45 * 130 - 65));
            needle.style.transform = `rotate(${angle}deg)`;
        }
        if (valDisplay) {
            const radVal = ((45 - Math.min(45, this.currentDistance)) * 0.42 + Math.random() * 0.2).toFixed(2);
            valDisplay.textContent = `${radVal} μSv/h`;
        }

        this.intervalId = setTimeout(() => this.tick(), delay);
    }
}

const GeigerCounter = new GeigerCounterClass();
window.GeigerCounter = GeigerCounter;
