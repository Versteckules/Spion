const CACHE_NAME = 'schattentausch-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './css/leaflet.css',
  './css/terminal.css',
  './css/cover.css',
  './css/map.css',
  './css/radar.css',
  './css/dossier.css',
  './css/nvg.css',
  './css/geiger.css',
  './css/testbar.css',
  './css/mobile.css',
  './js/leaflet.js',
  './js/config.js',
  './js/crypto.js',
  './js/audio.js',
  './js/gps.js',
  './js/map.js',
  './js/geiger.js',
  './js/phone.js',
  './js/radio.js',
  './js/stealth.js',
  './js/triage.js',
  './js/testuser.js',
  './js/events.js',
  './js/mobile.js',
  './js/game.js',
  './assets/img/avatar.jpg',
  './assets/img/cover_border.png',
  './assets/img/bnd_seal.svg',
  './assets/img/mfs_seal.svg',
  './assets/img/kgb_seal.svg',
  './assets/img/cyrillic_cipher.svg',
  './assets/img/person_xaver.png',
  './assets/img/person_schenk.png',
  './assets/img/person_woronin.png',
  './assets/img/person_erdmann.png',
  './assets/img/person_elster.png',
  './assets/img/person_richter.png',
  './assets/img/person_berger.png',
  './assets/audio/incident_bavarian.mp3',
  './assets/audio/incident_saxon.mp3',
  './assets/audio/kgb_woronin.mp3',
  './assets/audio/russian_station.mp3',
  './assets/audio/radio_bavarian.mp3',
  './assets/audio/radio_saxon.mp3',
  './assets/audio/event_patrol.mp3',
  './assets/audio/event_dog.mp3',
  './assets/audio/gunshot_echo.wav',
  './assets/audio/sirens_dogs.wav',
  './assets/audio/geiger_crackle.wav',
  './assets/audio/heartbeat_loop.wav',
  './assets/audio/morse_beacon.wav',
  './assets/audio/radio_static.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching offline assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        // Cache fetched tile images or dynamic assets
        if (response && response.status === 200 && event.request.method === 'GET') {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, respClone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback for failed offline fetches
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
