var IS_DEBUG = true;

importScripts('/sw-toolbox.js');

var forceUpdate = true,
    CACHE_NAME = 'cache';

toolbox.router.any('*', fetchHandler);
toolbox.router.any('*', fetchHandler, {origin: 'http://fonts.gstatic.com'});

function fetchHandler(req, values, options){
    if (IS_DEBUG) {
        return toolbox.networkFirst(req, values, options);
    } else {
        return toolbox.cacheFirst(req, values, options);
    }
}

function pRespondMessage(data){
    return Promise.resolve(data);
}

self.addEventListener('message', function(ev) {
    return pRespondMessage(ev.data)
        .then(function(value){
            ev.ports[0].postMessage({
                error: null,
                value: value
            });
        })
        .catch(function(err){
            ev.ports[0].postMessage({
                error: err,
                value: null
            });
        })
});

function pCheckUpdate() {
	return fetch('/manifest.json')
		.then(function(res) {
			return res.json();
		})
		.then(function(data) {
			return data.version;
		});
}
