const CACHE_NAME = "golden-edge-pwa-v3";
const VGK_UPDATES_URL = "/vgk-updates";
const APP_SHELL = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/pwa-icon-180.png",
  "/pwa-icon-192.png",
  "/pwa-icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});

self.addEventListener("push", (event) => {
  let payload = {
    title: "Golden Edge Analytics",
    body: "New VGK update available.",
    icon: "/pwa-icon-192.png",
    badge: "/pwa-icon-180.png",
    url: VGK_UPDATES_URL,
    tag: "golden-edge-update",
    data: {}
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      badge: payload.badge,
      body: payload.body,
      data: {
        ...payload.data,
        url: payload.url
      },
      icon: payload.icon,
      tag: payload.tag
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(event.notification.data?.url || VGK_UPDATES_URL, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }

      for (const client of clientList) {
        if (new URL(client.url).origin === self.location.origin && "navigate" in client) {
          return client.navigate(targetUrl).then((navigatedClient) => {
            if (navigatedClient && "focus" in navigatedClient) {
              return navigatedClient.focus();
            }

            return client.focus();
          });
        }
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});
