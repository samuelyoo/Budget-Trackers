// console.log('hey Im ready')

const CACHE_NAME = "my-site-chache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

var urlsToCache = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", function(event){
    event.waitUntil(
        cache.open(CACHE_NAME).then(function(chache) {
            console.log("Open chace");
            return chache.addAll(filesToCache);
        })
    )
})

self.addEventListener("fetch", function(event){
    
    if (event.requrest.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return(response => {
                    if (response.status === 200){
                        cache.put(event.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err=>{
                    return cache.match(event.request);
                });
            }).catch(err=> console.log(err))
        );
        return;
    }

    event.respondWith(
        fetch(event.request).catch(function(){
            return cache.match(event.request). then(function(response){
                if(response){
                    return response;   
                } else if (event.request.headers.get("accept").includes("text/html"))
                return chache.match("/");
            })
        })
    )

})

