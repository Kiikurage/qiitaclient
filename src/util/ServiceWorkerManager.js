var SW = {
	SUPPORTED: ('serviceWorker' in navigator),
	ERROR: {
		NOT_SUPPORTED: 'ServiceWorker is not supported in this browser.',
		NOT_REGISTERD: 'No ServiceWorker is registered.'
	}
};

/**
 * Register new service worker.
 * @return {Promise} resolved with register result.
 */
SW.pRegisterServiceWorker = function(){
	if (!SW.SUPPORTED) {
		return Promise.reject(SW.ERROR.NOT_SUPPORTED);
	}

	return navigator.serviceWorker.register('/sw.js');
};

/**
 * Send Message to SW
 * @param {Object} data the data send to SW
 * @return {Promise} resolved with the data respond from SW
 */
SW.pPostMessage = function(data){
	if (!SW.SUPPORTED) {
		return Promise.reject(SW.ERROR.NOT_SUPPORTED);
	}

	if (!navigator.serviceWorker.controller) {
		return Promise.reject(SW.ERROR.NOT_REGISTERD);
	}

	return new Promise(function(resolve, reject) {
		var cahnnel = new MessageChannel();

		cahnnel.port1.onmessage = function(event) {
			if (event.data.error) {
				reject(event.data.error);
			} else {
				resolve(event.data.value);
			}
		};

		return navigator.serviceWorker.controller.postMessage(data, [cahnnel.port2]);
	});
};

module.exports = SW;
