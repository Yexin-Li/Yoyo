// 自动生成，请勿手改。构建标记：76ca0e5280
const CACHE = "youyou-76ca0e5280";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-16.png",
  "./icon-16.png?v=7e6131b1d6",
  "./icon-32.png",
  "./icon-32.png?v=7e6131b1d6",
  "./icon-192.png",
  "./icon-192.png?v=7e6131b1d6",
  "./icon-512.png",
  "./icon-512.png?v=7e6131b1d6",
  "./icon-maskable-512.png",
  "./icon-maskable-512.png?v=7e6131b1d6",
  "./apple-touch-icon.png",
  "./apple-touch-icon.png?v=7e6131b1d6",
  "./favicon.ico",
  "./favicon.ico?v=7e6131b1d6"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // 页面导航：网络优先，缓存实际 URL（支持 tools/ 等子页面）；断网时按实际 URL 回落，再兜底主页
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match("./index.html").then((r2) => r2 || caches.match("./")))
        )
    );
    return;
  }

  // 静态资源：缓存优先，回退网络并缓存（让 tools/data-analyzed.js 等首次访问后离线可用）
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
    )
  );
});
