const appName = "restaurant-reviews";
const staticCacheName = appName + "-v1.0";
const contentImgCache = appName + '-images';

let allCaches = [
    staticCacheName,
    contentImgCache
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll([
                '/restaurant.html',
                '/index.html',
                '/css/styles.css',
                '/js/dbhelper.js',
                '/js/main.js',
                '/js/register-sw.js',
                '/js/restaurant_info.js',
                '/data/restaurants.json'


            ]);

        })
    );

});


self.addEventListener('activate', (event) =>  {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter( (cacheName) =>{
                    return cacheName.startsWith(appName) && !allCaches.includes(cacheName);
                }).map( (cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
        if(requestUrl.origin === location.origin){
            
            if(requestUrl.pathname.startsWith('/restaurant.html')) {
                event.respondWith(caches.match('/restaurant.html'));
                return;
            }
        }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});