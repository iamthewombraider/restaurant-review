console.log('Service Worker: Registered');
// self refers to the service worker object within the navigator
// object in this instance.
console.log(self);
//shows what has been stored inside the caches object, currently empty

//an array of files that we want stored within the caches object
// so they can be viewed even without an internet connection.
const cacheFiles = [
'/',
'/index.html',
'/restaurant.html',
'/js/dbhelper.js',
'/js/restaurant_info.js',
'/js/main.js',
'/img/1.jpg',
'/img/2.jpg',
'/img/3.jpg',
'/img/4.jpg',
'/img/5.jpg',
'/img/6.jpg',
'/img/7.jpg',
'/img/8.jpg',
'/img/9.jpg',
'/img/10.jpg',
'/data/restaurants.json',
'/css/styles.css'
]

// when the service worker file/ object is being installed
// the dom listens for that install event to fire.
// once it is triggered, the callback function uses the waitUntil
// method to stop the install event from completing while we wait
// for a cache file (V1) to be created and the cacheFiles array to
// be added to the cache file(V1). Then the install event will finish.
self.addEventListener('install', function(e) {
	console.log(e)
   e.waitUntil(
    caches.open('V1').then(function(cache) {
    	return cache.addAll(cacheFiles);
    })
   );
});



// we want to listen and intercept fetch events that our other
// js files might use. If the internet should be disconnected
// and there is a fetch request made, i must have the service worker
// respond with something other than the default fetch result.

self.addEventListener('fetch', function(e) {
	console.log(e);
	//e.respondWith will take the fetch.request and intercept it to
	// first check if there is a match for the request already within
	// the cache. If there is a response and there is a match, the 
	// service worker will return the url.
	e.respondWith(
		caches.match(e.request).then(function(response) {
			if (response) {
				console.log('Found ', e.request,' in cache');
				return response;
			}
//if there isnt a match, it takes fetches the request(a url) again
//and whatever the response is it takes it and adds the request and
// the response into our V1 cache. our catch at the end is to pick up
// any errors if there are any.
			else {
				console.log('Could not find', e.request, 'in cache, FETCHING!');
				return fetch(e.request)
				.then(function(response) {
					const clonedResponse = response.clone();
					caches.open('V1').then(function(cache) {
						cache.put(e.request, clonedResponse);
					})
					return response;
				})
				.catch(function(err) {
					console.error(err);
				});
			}
		}))
})
