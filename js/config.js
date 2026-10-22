/**
 * Zentrale Konfigurationsdatei für Geocache "Operation Schattentausch"
 * Grenze Bayern (Münchenreuth) / Sachsen (Gutenfürst)
 * Made by Versteckules
 */

const MISSION_CONFIG = {
    // Versionsinfo
    VERSION: "2.4.0",
    TITLE: "OPERATION SCHATTENTAUSCH – DER ZWISCHENFALL",
    AUTHOR: "Versteckules",
    YEAR: 1983,

    // GPS Toleranzen
    TOLERANCE_METERS: 10,       // ±10 Meter zum Auslösen des Checkpoints
    OFF_PATH_LIMIT_METERS: 18,  // Bei >18m Abweichung vom Weg schlägt der Minenalarm an

    // Start- und Wegpunkte WEST (Bayern / BND) entlang des befestigten Pfades
    WEST: {
        NAME: "Aktion Bayern-Adler (BND / Grenzpolizei Hof)",
        THEME: "amber",
        RADIO_FREQ: "462",
        CHECKPOINTS: [
            {
                id: 1,
                name: "Startposten West (Münchenreuth)",
                desc: "Initialisierung am bayerischen Grenzpfad",
                lat: 50.330406,
                lon: 12.069081,
                action: "boot"
            },
            {
                id: 2,
                name: "Wegbiegung (Vorstoß)",
                desc: "Sicht auf den Todesstreifen",
                lat: 50.330750,
                lon: 12.069250,
                action: "advance"
            },
            {
                id: 3,
                name: "Gefahrenzone am Grenzweg",
                desc: "Übergabepunkt - ZWISCHENFALL!",
                lat: 50.331100,
                lon: 12.069500,
                action: "incident"
            },
            {
                id: 4,
                name: "Deckungsmulde (Rückzug)",
                desc: "Geschützter Erdwall zur Triage",
                lat: 50.330600,
                lon: 12.069150,
                action: "fallback"
            },
            {
                id: 5,
                name: "Demarkationslinie (Finalzone)",
                desc: "Alter Bachdurchlass am Grenzgraben",
                lat: 50.331250,
                lon: 12.069600,
                action: "exchange"
            }
        ],
        // AES-256-GCM verschlüsselte Final-Koordinaten für Dose West
        ENCRYPTED_FINAL: {
            iv: "X9itd13lAbbNgxEc",
            data: "gb6AK8fXtfXc4qYK7cfFts0bw4YSjRmX5Gdr5kNvsHLtKp/N7I/KWRPY6vJ0gg5IYNaHesmSXQFy1e/Q2WYplZspPA50BmGVrUpyynXnd3f0oLFCBZJK+w=="
        }
    },

    // Start- und Wegpunkte OST (Sachsen / MfS) entlang des befestigten Pfades
    OST: {
        NAME: "Aktion Sachsen-Vogt (MfS / HA II Karl-Marx-Stadt)",
        THEME: "green",
        RADIO_FREQ: "480",
        CHECKPOINTS: [
            {
                id: 1,
                name: "Startposten Ost (Gutenfürst)",
                desc: "Initialisierung am sächsischen Kolonnenweg",
                lat: 50.331520,
                lon: 12.069700,
                action: "boot"
            },
            {
                id: 2,
                name: "Wegbiegung Kolonnenweg",
                desc: "Beobachtung der Demarkationslinie",
                lat: 50.331280,
                lon: 12.069620,
                action: "advance"
            },
            {
                id: 3,
                name: "Gefahrenzone Grenzgraben",
                desc: "Übergabepunkt - ZWISCHENFALL!",
                lat: 50.331100,
                lon: 12.069500,
                action: "incident"
            },
            {
                id: 4,
                name: "Schutzmulde (Rückzug)",
                desc: "Deckung hinter Betonelement",
                lat: 50.331400,
                lon: 12.069680,
                action: "fallback"
            },
            {
                id: 5,
                name: "Demarkationslinie (Finalzone)",
                desc: "Alter Bachdurchlass am Grenzgraben",
                lat: 50.331250,
                lon: 12.069600,
                action: "exchange"
            }
        ],
        // AES-256-GCM verschlüsselte Final-Koordinaten für Dose Ost
        ENCRYPTED_FINAL: {
            iv: "62GAxP/kQuu8vE6E",
            data: "Tqp8nCnK7mefFw+b54YMBqAYEvgjL2G3QjuJrbLbYkVEkJAKHOf9ZzhvieICrK5jlfomJwOksUZwGjgYOuF8AYzVrEvebqNtU7zOJzUjP4pGysRFMHcA2X319kq76A=="
        }
    },

    // Lösungs-Codes der Mission (Zur Schlüsselableitung)
    SOLUTIONS: {
        START_CODE: "1983",
        TRIAGE_CODE: "SOS",
        RADIO_FREQ_WEST: "462",
        RADIO_FREQ_OST: "480",
        RADIO_FREQ_KGB: "474",
        TRUE_MOLE: "RICHTER" // Hauptmann Richter hat geschossen
    },

    // Die 7 Dossier-Personen
    PERSONS: [
        {
            id: "xaver",
            name: "Xaver Huber",
            rank: "Polizeihauptkommissar",
            org: "Bayerische Grenzpolizei Hof / BND",
            img: "assets/img/person_xaver.png",
            desc: "Erfahrener Grenzermittler aus Oberfranken. Loyal, kennt jeden Stein am Zaun.",
            role: "Führungsoffizier West"
        },
        {
            id: "schenk",
            name: "Ronny Schenk",
            rank: "Oberstleutnant",
            org: "MfS Bezirksverwaltung Karl-Marx-Stadt",
            img: "assets/img/person_schenk.png",
            desc: "Strenger Stasi-Offizier. Misstraut allem und jedem, steht unter KGB-Druck.",
            role: "Führungsoffizier Ost"
        },
        {
            id: "woronin",
            name: "Igor Woronin",
            rank: "Major",
            org: "KGB Sonderabteilung Karlshorst",
            img: "assets/img/person_woronin.png",
            desc: "Sowjetischer Verbindungsoffizier. Befahl die Liquidierung bei Verrat.",
            role: "KGB-Kommando"
        },
        {
            id: "erdmann",
            name: "Dr. Manfred Görner",
            rank: "Leitender Physiker",
            org: "Robotron-Kombinat Dresden",
            img: "assets/img/person_erdmann.png",
            desc: "Deckname 'ERDMANN'. Wollte Mikrochip-Pläne übergeben. Am Bein angeschossen.",
            role: "Überläufer / Zielperson"
        },
        {
            id: "elster",
            name: "Klaus-Dieter Behrendt",
            rank: "Kundschafter",
            org: "HVA Ost-Berlin",
            img: "assets/img/person_elster.png",
            desc: "Deckname 'ELSTER'. In München vom BND verhaftet. Soll ausgetauscht werden.",
            role: "Gefangener"
        },
        {
            id: "richter",
            name: "Wolfgang Richter",
            rank: "Hauptmann",
            org: "NVA Grenztruppen Grenz-Regiment 33",
            img: "assets/img/person_richter.png",
            desc: "Scharfschütze und Grenzkompanie-Chef. Kaliber 7.62mm Übereinstimmung mit Beintreffer!",
            role: "DER HECKENSCHÜTZE (Verdächtig)",
            isGuilty: true
        },
        {
            id: "berger",
            name: "Thomas Berger",
            rank: "Unterleutnant",
            org: "Funkaufklärung MfS",
            img: "assets/img/person_berger.png",
            desc: "Nervöser Funker in der Leitstelle. War während des Schusses nachweislich an der Taste.",
            role: "Abhörer (Entlastet)",
            isGuilty: false
        }
    ]
};

// Automatisches Laden eigener Final-Koordinaten (über admin.html konfiguriert)
try {
    const customFinal = localStorage.getItem("SPION_CUSTOM_FINAL_CONFIG");
    if (customFinal) {
        const parsed = JSON.parse(customFinal);
        if (parsed.WEST_FINAL) MISSION_CONFIG.WEST.ENCRYPTED_FINAL = parsed.WEST_FINAL;
        if (parsed.OST_FINAL) MISSION_CONFIG.OST.ENCRYPTED_FINAL = parsed.OST_FINAL;
        if (parsed.SOLUTIONS) Object.assign(MISSION_CONFIG.SOLUTIONS, parsed.SOLUTIONS);
        console.log("🔒 [HQ CONFIG] Eigene Final-Koordinaten aus Owner-Speicher geladen.");
    }
} catch (e) {
    console.warn("Owner custom config parsing error", e);
}

window.MISSION_CONFIG = MISSION_CONFIG;
