/**
 * Dynamischer Zufallsereignis-Manager für "Operation Schattentausch"
 * - NVA Kübelwagen Streife (Motoren & 30s Ducken)
 * - Wachhunde im Unterholz
 * - Ionosphären-Störfront
 * - Geheimer Bonus-Abhörbericht
 */

class EventsEngineClass {
    constructor() {
        this.timer = null;
        this.activeEvent = null;
    }

    start() {
        // Schedule random events every 6 to 10 minutes if not in test
        this.scheduleNext();
    }

    scheduleNext() {
        const delay = (360 + Math.random() * 240) * 1000;
        this.timer = setTimeout(() => {
            this.triggerRandom();
            this.scheduleNext();
        }, delay);
    }

    triggerRandom() {
        const r = Math.random();
        if (r < 0.45) this.triggerPatrol();
        else if (r < 0.85) this.triggerDog();
        else this.triggerDrift();
    }

    triggerPatrol() {
        AudioEngine.play("assets/audio/event_patrol.mp3", 1.25, false);
        AudioEngine.vibrate([200, 100, 200, 100, 500]);

        if (window.GameEngine && window.GameEngine.showInGameModal) {
            window.GameEngine.showInGameModal(
                "🚨 ACHTUNG: GRENZPATROUILLE NÄHERT SICH!",
                "Ein NVA-Kübelwagen passiert den Kolonnenweg! Motorengeräusch voraus! Sofort stillhalten und im Graben abtauchen!",
                "IN DECKUNG GEHEN (30s)"
            );
        }
    }

    triggerDog() {
        AudioEngine.play("assets/audio/event_dog.mp3", 1.25, false);
        AudioEngine.vibrate([400, 150, 400]);

        if (window.GameEngine && window.GameEngine.showInGameModal) {
            window.GameEngine.showInGameModal(
                "🐕 WACHHUNDE IM UNTERHOLZ!",
                "Hundegebell im Grenzstreifen! Sie wittern Bewegung. Bleiben Sie regungslos stehen!",
                "REGUNGSLOS VERHARREN"
            );
        }
    }

    triggerDrift() {
        if (window.RadioTuner) {
            window.RadioTuner.setFrequency(window.RadioTuner.currentFreq + 4);
        }
        if (window.GameEngine && window.GameEngine.showInGameModal) {
            window.GameEngine.showInGameModal(
                "⚡ IONOSPHÄREN-STÖRFRONT!",
                "Atmosphärische Störungen verzerren den Kurzwellenempfang! Justieren Sie die Frequenz am Funkgerät nach.",
                "VERSTANDEN"
            );
        }
    }
}

const EventsEngine = new EventsEngineClass();
window.EventsEngine = EventsEngine;
