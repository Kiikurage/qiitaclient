var API = module.exports;

/**
 * @TODO
 * プロトコルはhttpsオンリー?
 */
API.ENDPOINT = 'http://qiita.com/api/v2';

/**
 * @TODO secretを埋め込まなくても良いようにしたい!!
 */
var CLIENT_ID = '22c9d41a4eefc12bdd65d402d7865810c3a0e675',
	CLIENT_SECRET = '4b35ef47a4ca86c73d4be8de0f0d5ad25d38ab3e';


API.accessToken = null;
API.scopes = [];

//------------------------------------------------------------------------------
// Authorization

var pInit_ = null
API.pInit = function() {
	if (pInit_) return pInit_;

	API.accessToken = localStorage.getItem('token');
	if (API.accessToken) return pInit_ = Promise.resolve();

	var query = location.search,
		params = API.decodeURLParam(query.substr(1)),
		code = params['code'];

	if (code) {
		history.replaceState(null, null, location.pathname);
	} else {
		return Promise.reject('not authorized yet.');
	}

	return pInit_ = API.pGetAccessToken(code);
}

API.authorize = function() {
	document.location.href = API.ENDPOINT + '/oauth/authorize?' + API.encodeURLParam({
		'client_id': CLIENT_ID,
		'scope': 'read_qiita write_qiita'
	});
};

API.pDeauthorize = function(flagReload) {
	var self = this;

	if (!this.accessToken) return Promise.resolve();

	return API.pDelete('/access_tokens/'+API.accessToken)
		.then(function(){
			localStorage.setItem('token', '');
			self.accessToken = null;

			if (flagReload) {
				document.location.href = '/';
			}
		});
};

API.pGetAccessToken = function(code) {
	return API.pPost('/access_tokens', {
			'client_id': CLIENT_ID,
			'client_secret': CLIENT_SECRET,
			'code': code
		})
		.then(function(data) {
			API.accessToken = data.token;
			API.scopes = data.scopes;

			localStorage.setItem('token', API.accessToken);
		});
};

//------------------------------------------------------------------------------
// Core functions

/**
 * HTTP GET
 * @param {string} url
 * @param {Object} params
 */
API.pGet = function(url, params) {
	var option = {
		method: 'GET',
		headers: {}
	};

	if (params) {
		url += '?' + API.encodeURLParam(params);
	}

	if (API.accessToken) {
		option.headers['Authorization'] = 'Bearer ' + API.accessToken;
	}

	return fetch(API.ENDPOINT + url, option)
		.then(function(res) {
			return res.json();
		});
};

/**
 * HTTP POST
 * @param {string} url
 * @param {Object} params
 */
API.pPost = function(url, params) {
	var option = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params)
	};

	if (API.accessToken) {
		option.headers['Authorization'] = 'Bearer ' + API.accessToken;
	}

	return fetch(API.ENDPOINT + url, option)
		.then(function(res) {
			return res.json();
		});
};

/**
 * HTTP DELETE
 * @param {string} url
 * @param {Object} params
 */
API.pDelete = function(url) {
	var option = {
		method: 'DELETE',
		headers: {}
	};

	if (API.accessToken) {
		option.headers['Authorization'] = 'Bearer ' + API.accessToken;
	}

	return fetch(API.ENDPOINT + url, option)
};

/**
 * create url parameter query from dictionary
 * @param {Object} params
 * @return {string} query
 */
API.encodeURLParam = function(params) {
	return Object.keys(params)
		.map(function(key) {
			return key + '=' + encodeURIComponent(params[key]);
		})
		.join('&');
};

API.decodeURLParam = function(paramStr) {
	return paramStr.split('&')
		.reduce(function(result, query) {
			var parts = query.split('=');
			if (parts.length === 2) {
				result[parts[0]] = decodeURIComponent(parts[1]);
			}
			return result;
		}, {});
};
