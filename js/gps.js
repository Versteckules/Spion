/**
 * GPS Engine & Pfad-Assistent für Geocache "Operation Schattentausch"
 * - Haversine-Distanz & Peilkompass (Heading)
 * - ±10m Zonen-Erkennung
 * - Minenstreifen-Warnung bei Verlassen des befestigten Wegs (>18m)
 * - Unterstützt Live-GPS & Sofa-Simulation (OFFLINETEST)
 */

class GPSEngineClass {
    constructor() {
        this.watchId = null;
        this.currentLat = null;
        this.currentLon = null;
        this.currentAccuracy = null;
        this.targetLat = null;
        this.targetLon = null;
        this.isSimulated = false;
        this.pathWaypoints = [];
        this.onLocationUpdate = null;
        this.onZoneEntered = null;
        this.onOffPathWarning = null;
    }

    /**
     * Start live GPS tracking
     */
    startTracking() {
        if (!navigator.geolocation) {
            console.warn("Geolocation API nicht unterstützt.");
            return;
        }

        this.watchId = navigator.geolocation.watchPosition(
            (pos) => {
                if (this.isSimulated) return;
                this.updateLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
            },
            (err) => {
                console.warn("GPS-Signalfehler:", err.message);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 2000,
                timeout: 10000
            }
        );
    }

    /**
     * Stop live tracking
     */
    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    /**
     * Set target checkpoint
     */
    setTarget(lat, lon) {
        this.targetLat = lat;
        this.targetLon = lon;
        if (this.currentLat !== null && this.currentLon !== null) {
            this.evaluatePosition();
        }
    }

    /**
     * Set path trail waypoints for off-path checking
     */
    setPathWaypoints(waypoints) {
        this.pathWaypoints = waypoints;
    }

    /**
     * Simulate location for OFFLINETEST
     */
    simulateLocation(lat, lon, accuracy = 3) {
        this.isSimulated = true;
        this.updateLocation(lat, lon, accuracy);
    }

    /**
     * Process updated location
     */
    updateLocation(lat, lon, accuracy) {
        this.currentLat = lat;
        this.currentLon = lon;
        this.currentAccuracy = accuracy;

        this.evaluatePosition();

        if (this.onLocationUpdate) {
            const dist = this.targetLat !== null ? this.getDistance(lat, lon, this.targetLat, this.targetLon) : null;
            const bearing = this.targetLat !== null ? this.getBearing(lat, lon, this.targetLat, this.targetLon) : 0;
            this.onLocationUpdate({
                lat, lon, accuracy, dist, bearing, isSimulated: this.isSimulated
            });
        }
    }

    /**
     * Evaluate distance to target and path
     */
    evaluatePosition() {
        if (this.currentLat === null || this.targetLat === null) return;

        const distToTarget = this.getDistance(this.currentLat, this.currentLon, this.targetLat, this.targetLon);

        // Check if inside ±10m tolerance zone
        if (distToTarget <= (MISSION_CONFIG.TOLERANCE_METERS || 10)) {
            if (this.onZoneEntered) {
                this.onZoneEntered(distToTarget);
            }
        }

        // Check off-path distance to trail
        if (this.pathWaypoints.length >= 2) {
            const distToPath = this.getMinDistanceToPath(this.currentLat, this.currentLon, this.pathWaypoints);
            const limit = MISSION_CONFIG.OFF_PATH_LIMIT_METERS || 18;
            if (distToPath > limit) {
                if (this.onOffPathWarning) {
                    this.onOffPathWarning(true, distToPath);
                }
            } else {
                if (this.onOffPathWarning) {
                    this.onOffPathWarning(false, distToPath);
                }
            }
        }
    }

    /**
     * Haversine distance in meters
     */
    getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Radius der Erde in m
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.round(R * c);
    }

    /**
     * Compass bearing in degrees (0 = North, 90 = East)
     */
    getBearing(lat1, lon1, lat2, lon2) {
        const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
        const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
                  Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
        const brng = Math.atan2(y, x) * 180 / Math.PI;
        return (brng + 360) % 360;
    }

    /**
     * Calculate minimum distance from point to a polyline
     */
    getMinDistanceToPath(lat, lon, waypoints) {
        let minDist = Infinity;
        for (let i = 0; i < waypoints.length; i++) {
            const d = this.getDistance(lat, lon, waypoints[i].lat, waypoints[i].lon);
            if (d < minDist) minDist = d;
        }
        return minDist;
    }
}

const GPSEngine = new GPSEngineClass();
window.GPSEngine = GPSEngine;
