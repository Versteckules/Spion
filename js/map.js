/**
 * Hybrid OpenStreetMap Engine für Geocache "Operation Schattentausch"
 * - Leaflet.js OSM-Livekarte mit abgetöntem Dark/Military Stil
 * - Grenzlinien-Overlay Bayern/Sachsen & Pfad-Polyline
 * - Taktischer Vektorkarten-Fallback bei Funkloch im Wald
 * - Robuste Initialisierung ohne NaN-Zoom-Fehler bei versteckten Containern
 */

class MapEngineClass {
    constructor() {
        this.map = null;
        this.playerMarker = null;
        this.pathLine = null;
        this.borderLine = null;
        this.checkpointMarkers = [];
        this.isLeafletAvailable = false;
        this.pendingCheckpoints = null;
        this.pendingFitBounds = false;
        this.isVectorActive = false;
        this.containerId = "map-container";
        this.lastLat = 50.33100;
        this.lastLon = 12.06940;
    }

    /**
     * Initialize Map inside DOM container
     */
    init(containerId = "map-container") {
        this.containerId = containerId;
        const container = document.getElementById(containerId);
        if (!container) return;

        if (typeof L !== 'undefined') {
            this.isLeafletAvailable = true;
            this.initLeaflet(container);
        } else {
            console.warn("Leaflet nicht gefunden - schalte Vektorkarte ein");
            this.initVectorFallback(container);
        }
    }

    /**
     * Leaflet OSM initialization
     */
    initLeaflet(container) {
        if (this.map) {
            try { this.map.invalidateSize(true); } catch (e) {}
            return;
        }

        // Center at border between Münchenreuth and Gutenfürst
        const center = [50.33100, 12.06940];

        try {
            this.map = L.map(container, {
                center: center,
                zoom: 16,
                zoomControl: true,
                attributionControl: false,
                minZoom: 12,
                maxZoom: 19
            });

            // High-reliability OSM tiles with local military phosphor CSS filter
            const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                subdomains: 'abc',
                timeout: 8000
            });

            tileLayer.on('tileerror', () => {
                console.warn("OSM Tile Ladefehler - Vektor-Modus steht bereit");
            });

            tileLayer.addTo(this.map);

            // Add custom styled border line (Demarkationslinie)
            const borderCoords = [
                [50.33300, 12.06850],
                [50.33180, 12.06920],
                [50.33080, 12.06950],
                [50.32950, 12.06990]
            ];
            this.borderLine = L.polyline(borderCoords, {
                color: '#c93b3b',
                weight: 4,
                dashArray: '8, 6',
                opacity: 0.95
            }).addTo(this.map).bindTooltip("DEMARKATIONSLINIE (Grenzgraben)", { permanent: true, className: "border-tooltip" });

            // Add player marker
            const playerIcon = L.divIcon({
                className: 'player-gps-blip',
                html: '<div class="radar-pulse"></div><div class="radar-dot"></div>',
                iconSize: [24, 24]
            });
            this.playerMarker = L.marker(center, { icon: playerIcon }).addTo(this.map);

            // In case checkpoints were registered before Leaflet init
            if (this.pendingCheckpoints) {
                this.loadFactionPath(this.pendingCheckpoints);
            }

            // Inject tactical on-map overlay controls
            this.injectMapControls(container);

        } catch (e) {
            console.error("Leaflet Init fehlgeschlagen:", e);
            this.initVectorFallback(container);
        }
    }

    /**
     * Inject tactical floating map buttons
     */
    injectMapControls(container) {
        if (document.getElementById("tactical-map-toolbar")) return;

        const toolbar = document.createElement("div");
        toolbar.id = "tactical-map-toolbar";
        toolbar.className = "tactical-map-toolbar";
        toolbar.innerHTML = `
            <button class="map-ctrl-btn return-btn" onclick="GameEngine.switchTab('terminal')" title="Zurück zur aktuellen Station">
                📟 ZUR STATION
            </button>
            <button class="map-ctrl-btn" onclick="MapEngine.recenterOnPlayer()" title="Auf eigene GPS-Position zentrieren">
                🎯 STANDORT
            </button>
            <button class="map-ctrl-btn" onclick="MapEngine.fitRoute()" title="Gesamte Route anzeigen">
                📍 ROUTE
            </button>
            <button class="map-ctrl-btn" onclick="MapEngine.toggleVectorMode()" title="Zwischen OSM-Kacheln und Vektor-Fallback wechseln">
                🛰️ VEKTOR
            </button>
        `;
        container.appendChild(toolbar);
    }

    /**
     * Draw checkpoints and path polyline for selected faction
     */
    loadFactionPath(checkpoints) {
        this.pendingCheckpoints = checkpoints;

        if (!this.isLeafletAvailable || !this.map) return;

        // Clear existing markers
        this.checkpointMarkers.forEach(m => this.map.removeLayer(m));
        this.checkpointMarkers = [];
        if (this.pathLine) this.map.removeLayer(this.pathLine);

        const latlngs = checkpoints.map(cp => [cp.lat, cp.lon]);

        // Draw trail polyline
        this.pathLine = L.polyline(latlngs, {
            color: '#d4af37',
            weight: 4,
            dashArray: '5, 5',
            opacity: 0.95
        }).addTo(this.map);

        // Add numbered checkpoint markers
        checkpoints.forEach((cp, idx) => {
            const cpIcon = L.divIcon({
                className: 'checkpoint-icon',
                html: `<div class="cp-badge">${idx + 1}</div>`,
                iconSize: [28, 28]
            });
            const marker = L.marker([cp.lat, cp.lon], { icon: cpIcon })
                .addTo(this.map)
                .bindPopup(`<div style="font-family:monospace; color:#111; padding: 4px;"><b>Station ${idx + 1}: ${cp.name}</b><br>${cp.desc || 'Geheimtreffpunkt an der Demarkationslinie'}</div>`);
            this.checkpointMarkers.push(marker);
        });

        // Safe bounds fitting
        const container = document.getElementById(this.containerId);
        if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
            try {
                this.map.fitBounds(this.pathLine.getBounds(), { padding: [35, 35], maxZoom: 17 });
                this.pendingFitBounds = false;
            } catch (e) {
                this.pendingFitBounds = true;
            }
        } else {
            this.pendingFitBounds = true;
        }
    }

    /**
     * Called whenever tab is switched to 'map'
     */
    onTabVisible() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // If map was not initialized or container was previously 0-sized
        if (!this.map && typeof L !== 'undefined') {
            this.initLeaflet(container);
        } else if (this.map && typeof L !== 'undefined') {
            try {
                const s = this.map.getSize();
                if (s.x === 0 || s.y === 0) {
                    this.map.remove();
                    this.map = null;
                    this.initLeaflet(container);
                }
            } catch(e) {
                this.map = null;
                this.initLeaflet(container);
            }
        }

        if (this.map) {
            try { 
                this.map.invalidateSize(true); 
                this.map.setView([this.lastLat, this.lastLon], 16);
            } catch (e) {}

            // Staggered resize attempts to guarantee tile rendering
            [30, 100, 250, 500].forEach(delay => {
                setTimeout(() => {
                    if (!this.map) return;
                    try {
                        this.map.invalidateSize(true);

                        const z = this.map.getZoom();
                        if (isNaN(z) || z === undefined || z < 10) {
                            this.map.setView([this.lastLat, this.lastLon], 16);
                        }

                        if (this.pendingFitBounds && this.pathLine) {
                            this.map.fitBounds(this.pathLine.getBounds(), { padding: [35, 35], maxZoom: 17 });
                            this.pendingFitBounds = false;
                        }
                    } catch (err) {
                        console.warn("Fehler bei map.invalidateSize:", err);
                    }
                }, delay);
            });
        }
    }

    /**
     * Jump directly to a station on the map
     */
    showStationOnMap(stationIndex) {
        if (window.GameEngine) {
            window.GameEngine.switchTab("map");
        }
        setTimeout(() => {
            if (!this.map) return;
            this.map.invalidateSize(true);
            if (this.pendingCheckpoints && this.pendingCheckpoints[stationIndex]) {
                const cp = this.pendingCheckpoints[stationIndex];
                this.map.setView([cp.lat, cp.lon], 17, { animate: true });
                if (this.checkpointMarkers && this.checkpointMarkers[stationIndex]) {
                    this.checkpointMarkers[stationIndex].openPopup();
                }
            } else {
                this.fitRoute();
            }
        }, 120);
    }

    /**
     * Recenter map on player GPS position
     */
    recenterOnPlayer() {
        if (!this.map) return;
        let lat = this.lastLat;
        let lon = this.lastLon;
        if (window.GPSEngine && window.GPSEngine.currentLat) {
            lat = window.GPSEngine.currentLat;
            lon = window.GPSEngine.currentLon;
        }
        this.map.setView([lat, lon], 17, { animate: true });
        if (this.playerMarker) {
            this.playerMarker.setLatLng([lat, lon]);
        }
    }

    /**
     * Fit entire mission route
     */
    fitRoute() {
        if (this.map && this.pathLine) {
            try {
                this.map.fitBounds(this.pathLine.getBounds(), { padding: [35, 35], maxZoom: 17 });
            } catch (e) {
                this.map.setView([50.33100, 12.06940], 16);
            }
        }
    }

    /**
     * Toggle Vector Fallback Mode
     */
    toggleVectorMode() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        this.isVectorActive = !this.isVectorActive;
        if (this.isVectorActive) {
            this.initVectorFallback(container);
        } else {
            container.innerHTML = "";
            this.map = null;
            this.initLeaflet(container);
            if (this.pendingCheckpoints) {
                this.loadFactionPath(this.pendingCheckpoints);
            }
            this.onTabVisible();
        }
    }

    /**
     * Update player marker position on map
     */
    updatePlayerPosition(lat, lon) {
        this.lastLat = lat;
        this.lastLon = lon;
        if (!this.map || !this.playerMarker) return;
        this.playerMarker.setLatLng([lat, lon]);
    }

    /**
     * Offline Tactical Vector Fallback (SVG)
     */
    initVectorFallback(container) {
        container.innerHTML = `
            <div class="vector-map-fallback">
                <div class="tactical-grid"></div>
                <div class="vector-info-banner">
                    ⚠️ OFFLINE-VEKTORKARTE AKTIV [Grenzabschnitt Münchenreuth - Gutenfürst]
                    <button class="map-ctrl-btn" style="margin-left: 8px;" onclick="MapEngine.toggleVectorMode()">
                        🗺️ ZUR OSM-KARTE
                    </button>
                </div>
                <svg viewBox="0 0 400 300" class="vector-svg-map">
                    <!-- Border line -->
                    <line x1="200" y1="20" x2="200" y2="280" stroke="#c93b3b" stroke-width="3" stroke-dasharray="6,4" />
                    <text x="110" y="40" fill="#d4af37" font-size="12" font-family="monospace">BAYERN (BRD)</text>
                    <text x="215" y="40" fill="#4caf50" font-size="12" font-family="monospace">SACHSEN (DDR)</text>
                    <!-- Trail path -->
                    <path d="M 80,240 Q 140,160 200,140 T 320,60" fill="none" stroke="#d4af37" stroke-width="4" stroke-dasharray="4,4" />
                    <!-- Points -->
                    <circle cx="80" cy="240" r="8" fill="#d4af37" />
                    <text x="75" y="265" fill="#d4af37" font-size="10" font-family="monospace">P1 (0m)</text>
                    <circle cx="200" cy="140" r="10" fill="#c93b3b" />
                    <text x="180" y="125" fill="#c93b3b" font-size="11" font-weight="bold" font-family="monospace">ZWISCHENFALL (85m)</text>
                    <circle cx="320" cy="60" r="8" fill="#4caf50" />
                    <text x="300" y="85" fill="#4caf50" font-size="10" font-family="monospace">P5 (110m)</text>
                </svg>
            </div>
        `;
    }
}

const MapEngine = new MapEngineClass();
window.MapEngine = MapEngine;
