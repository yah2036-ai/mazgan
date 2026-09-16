/* service worker של ה-PWA. תפקיד אחד: שהאפליקציה תיפתח גם כשאין רשת,
   כדי להציג «מתחבר…» במקום דף שגיאה של הדפדפן. רשת קודם, מטמון כגיבוי.
   הקופסה עצמה לא מגישה את הקובץ הזה — הוא קיים רק ב-GitHub Pages. */
const CACHE = 'mazgan-v1';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
