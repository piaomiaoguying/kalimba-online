const CACHE_NAME = 'kalimba-game-cache-v1';
// 加载超时时间（毫秒）
const CACHE_TIMEOUT = 400;
// 要缓存的 URL 列表
const urlsToCache = [
    './css/kalimba.css',
    './css/pico-color-picker.css',
    './css/pico-theme-switcher.css',
    './img/144.png',
    './img/152.png',
    './img/192.png',
    './img/512.png',
    // './img/screen1.png',
    // './img/screen2.png',
    // './img/screen3.png',
    './js/fullscreen.js',
    './js/kalimba.js',
    './js/lang.js',
    './js/pico-color-picker.js',
    './js/pico-theme-switcher.js',
    './lang/ar.json',
    './lang/de.json',
    './lang/en.json',
    './lang/es.json',
    './lang/fr.json',
    './lang/id.json',
    './lang/ja.json',
    './lang/pt.json',
    './lang/ru.json',
    './lang/zh-CN.json',
    './soundfonts/keylimba/kalimba.mp3.js',
    './favicon.ico',
    './index.html',
    // './manifest.json',
    // './service-worker.js',
    'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/soundfont-player@0.12.0/dist/soundfont-player.min.js',
    'https://cdn.jsdelivr.net/npm/@picocss/pico@1.5.13/css/pico.min.css',
    'https://gleitz.github.io/midi-js-soundfonts/FatBoy/kalimba-mp3.js',
    'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/kalimba-mp3.js',
];

// 安装 service-worker 时初始化缓存
const initCache = () => {
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    }, (error) => {
        console.log(error)
    });
};

// 尝试通过网络获取数据，并设置超时
const tryNetwork = (req, timeout) => {
    // console.log(req)
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(req).then((res) => {
            clearTimeout(timeoutId);
            const responseClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(req, responseClone)
            })
            resolve(res);
            // 如果网络请求失败，则拒绝 Promise。
        }, reject);
    });
};

// 在没有网络时从缓存获取数据
const getFromCache = (req) => {
    console.log('[Service-worker] 无法从互联网加载数据，从缓存获取数据...');
    console.log(req.url);
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(req).then((result) => {
            return result || Promise.reject("no-match");
        });
    });
};

// service-worker 安装事件
self.addEventListener("install", (e) => {
    console.log("[Service-worker] 已安装");
    e.waitUntil(initCache());
});

// service-worker 激活事件
self.addEventListener('activate', (e) => {
    console.log("[Service-worker] 已激活");
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// 获取请求事件
self.addEventListener("fetch", (e) => {
    // console.log("[Service-worker] 尝试从网络或缓存获取数据: " + e.request.url);
    // 尝试从网络获取数据，如果失败则返回缓存的副本。
    e.respondWith(tryNetwork(e.request, CACHE_TIMEOUT).catch(() => getFromCache(e.request)));
});
