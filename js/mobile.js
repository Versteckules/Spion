/**
 * Mobile UX & Outdoor Engine für Geocache "Operation Schattentausch"
 * Entwickelt für den anspruchsvollen Außeneinsatz im Gelände:
 * 1. Screen Wake Lock API (verhindert Bildschirm-Abschalten beim Laufen)
 * 2. High-Contrast Outdoor Sonnenmodus (☀️ scharfe Lesbarkeit bei hellem Tageslicht)
 * 3. Echter Hardware-Kompass (DeviceOrientation mit iOS webkitCompassHeading)
 * 4. Taktile Haptik (Vibration API) auf allen Touch-Bedienelementen
 * 5. Live GPS-Genauigkeitsanzeige (±X Meter mit Ampel-Status)
 * 6. One-Hand Thumb-Ergonomie & Floating Map-Recenter
 * 7. State-Persistence (Automatisches Wiederaufnehmen bei Tab-Schließen)
 */

class MobileUXEngineClass {
    constructor() {
        this.wakeLock = null;
        this.isWakeLockActive = false;
        this.isSunlightMode = false;
        this.currentHeading = 0;
        this.targetBearing = 0;
        this.hasOrientationPermission = false;
        this.savedStateKey = "SPION_MISSION_PROGRESS_V2";
    }

    /**
     * Initialize Mobile UX
     */
    init() {
        console.log("📱 Mobile UX Engine initialisiert.");

        // Check sunlight mode preference from storage
        const savedSunlight = localStorage.getItem("SPION_SUNLIGHT_MODE");
        if (savedSunlight === "1") {
            this.setSunlightMode(true);
        }

        // Global touch unlock for audio
        const unlockAudio = () => {
            if (window.AudioEngine) window.AudioEngine.init();
            document.removeEventListener("touchstart", unlockAudio);
            document.removeEventListener("click", unlockAudio);
        };
        document.addEventListener("touchstart", unlockAudio, { passive: true });
        document.addEventListener("click", unlockAudio, { passive: true });

        // Setup global haptic tap listener on buttons
        this.bindHapticTaps();

        // Setup Device Orientation (Hardware Kompass)
        this.initCompass();

        // Handle page visibility change (Wake Lock re-acquire)
        document.addEventListener("visibilitychange", async () => {
            if (document.visibilityState === "visible" && this.isWakeLockActive) {
                await this.requestWakeLock();
            }
        });

        // Setup map recenter floating button
        this.setupMapRecenterBtn();
    }

    /**
     * Request Screen Wake Lock (keep screen awake outdoors)
     */
    async requestWakeLock() {
        if ("wakeLock" in navigator) {
            try {
                this.wakeLock = await navigator.wakeLock.request("screen");
                this.isWakeLockActive = true;
                this.updateWakeLockUI(true);
                this.wakeLock.addEventListener("release", () => {
                    this.isWakeLockActive = false;
                    this.updateWakeLockUI(false);
                });
                console.log("💡 Screen Wake Lock aktiv: Display bleibt eingeschaltet.");
            } catch (err) {
                console.log("Wake Lock nicht verfügbar:", err.message);
                this.isWakeLockActive = false;
                this.updateWakeLockUI(false);
            }
        }
    }

    /**
     * Release Screen Wake Lock
     */
    async releaseWakeLock() {
        if (this.wakeLock !== null) {
            try {
                await this.wakeLock.release();
                this.wakeLock = null;
            } catch (e) {}
        }
        this.isWakeLockActive = false;
        this.updateWakeLockUI(false);
    }

    toggleWakeLock() {
        if (this.isWakeLockActive) {
            this.releaseWakeLock();
        } else {
            this.requestWakeLock();
        }
    }

    updateWakeLockUI(isActive) {
        const btn = document.getElementById("btn-toggle-wakelock");
        if (btn) {
            btn.className = `quick-tool-btn ${isActive ? 'active' : ''}`;
            btn.innerHTML = isActive ? "💡 DISPLAY: AN" : "💡 DISPLAY: AUS";
            btn.title = isActive ? "Display bleibt im Außeneinsatz dauerhaft an" : "Klicken um Display dauerhaft anzulassen";
        }
    }

    /**
     * High Contrast Outdoor Sonnenmodus
     */
    setSunlightMode(enable) {
        this.isSunlightMode = enable;
        document.body.classList.toggle("mode-sunlight", enable);
        localStorage.setItem("SPION_SUNLIGHT_MODE", enable ? "1" : "0");

        const btn = document.getElementById("btn-toggle-sunlight");
        if (btn) {
            btn.className = `quick-tool-btn ${enable ? 'active' : ''}`;
            btn.innerHTML = enable ? "☀️ SONNE: AN" : "☀️ SONNE";
            btn.title = enable ? "Sonnenmodus aktiv (Ultra-Kontrast, kein CRT-Glühen)" : "Sonnenmodus für direktes Tageslicht aktivieren";
        }
    }

    toggleSunlightMode() {
        this.vibrate(20);
        this.setSunlightMode(!this.isSunlightMode);
    }

    /**
     * Device Orientation / Hardware Kompass
     */
    initCompass() {
        const handleOrientation = (e) => {
            let heading = null;

            // iOS WebKit heading (real degrees from magnetic north)
            if (typeof e.webkitCompassHeading !== "undefined") {
                heading = e.webkitCompassHeading;
            } else if (e.absolute === true || e.alpha !== null) {
                // Android standard orientation (360 - alpha for direction)
                heading = (360 - e.alpha) % 360;
            }

            if (heading !== null && !isNaN(heading)) {
                this.currentHeading = heading;
                this.updateCompassNeedle();
            }
        };

        // Check if permission required (iOS 13+)
        if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
            // Permission will be asked on user interaction
            this.requestOrientationPermission = () => {
                DeviceOrientationEvent.requestPermission().then(state => {
                    if (state === "granted") {
                        window.addEventListener("deviceorientation", handleOrientation, true);
                        this.hasOrientationPermission = true;
                    }
                }).catch(e => console.log("Orientation permission error:", e));
            };
        } else {
            // Android / Standard
            if ("ondeviceorientationabsolute" in window) {
                window.addEventListener("deviceorientationabsolute", handleOrientation, true);
            } else if ("ondeviceorientation" in window) {
                window.addEventListener("deviceorientation", handleOrientation, true);
            }
            this.hasOrientationPermission = true;
        }
    }

    setTargetBearing(bearing) {
        this.targetBearing = bearing;
        this.updateCompassNeedle();
    }

    updateCompassNeedle() {
        const needle = document.getElementById("radar-compass-needle");
        if (!needle) return;

        // Needle points toward target bearing relative to phone heading
        const relativeAngle = (this.targetBearing - this.currentHeading + 360) % 360;
        needle.style.transform = `rotate(${relativeAngle}deg)`;
    }

    /**
     * Update GPS Accuracy Badge in Top Bar
     */
    updateGPSAccuracy(accuracyMeters) {
        const badge = document.getElementById("gps-accuracy-badge");
        if (!badge) return;

        if (accuracyMeters === null || accuracyMeters === undefined) {
            badge.className = "gps-badge searching";
            badge.innerHTML = "📡 GPS: SUCHE...";
            return;
        }

        const acc = Math.round(accuracyMeters);
        if (acc <= 6) {
            badge.className = "gps-badge optimal";
            badge.innerHTML = `🟢 GPS: ±${acc}m`;
            badge.title = `Hervorragende GPS-Präzision (±${acc} Meter)`;
        } else if (acc <= 14) {
            badge.className = "gps-badge good";
            badge.innerHTML = `🟡 GPS: ±${acc}m`;
            badge.title = `Gute GPS-Präzision (±${acc} Meter)`;
        } else {
            badge.className = "gps-badge poor";
            badge.innerHTML = `🔴 GPS: ±${acc}m`;
            badge.title = `Ungenaues GPS-Signal (±${acc} Meter) - Unter Bäumen Geduld haben`;
        }
    }

    /**
     * Haptic Vibration Manager
     */
    vibrate(pattern) {
        if ("vibrate" in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {}
        }
    }

    bindHapticTaps() {
        document.addEventListener("click", (e) => {
            const btn = e.target.closest("button, .faction-card-btn, .menu-tab-btn, .btn-branch-card, .btn-mole-opt");
            if (btn) {
                this.vibrate(18); // Short tactile feedback
            }
        }, { passive: true });
    }

    /**
     * Floating Map Recenter Button
     */
    setupMapRecenterBtn() {
        const mapContainer = document.getElementById("map-container");
        if (!mapContainer || document.getElementById("btn-map-recenter")) return;

        const recenterBtn = document.createElement("button");
        recenterBtn.id = "btn-map-recenter";
        recenterBtn.className = "btn-map-recenter-float";
        recenterBtn.innerHTML = `<span>🎯</span> STANDORT ZENTRIEREN`;
        recenterBtn.onclick = () => {
            this.vibrate(30);
            if (window.MapEngine && window.MapEngine.map && window.GPSEngine) {
                const lat = window.GPSEngine.currentLat || 50.33100;
                const lon = window.GPSEngine.currentLon || 12.06940;
                window.MapEngine.map.setView([lat, lon], 18, { animate: true });
            }
        };
        mapContainer.appendChild(recenterBtn);
    }

    /**
     * Mission State Auto-Save & Resume
     */
    saveProgress(state) {
        try {
            localStorage.setItem(this.savedStateKey, JSON.stringify({
                ...state,
                timestamp: Date.now()
            }));
        } catch (e) {}
    }

    getSavedProgress() {
        try {
            const raw = localStorage.getItem(this.savedStateKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            // Valid if saved in the last 48 hours
            if (Date.now() - parsed.timestamp < 48 * 3600 * 1000) {
                return parsed;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    clearSavedProgress() {
        try {
            localStorage.removeItem(this.savedStateKey);
        } catch (e) {}
    }
}

const MobileUX = new MobileUXEngineClass();
window.MobileUX = MobileUX;
