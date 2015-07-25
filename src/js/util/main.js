/**
 * import libraries.
 */

/**
 * @TODO
 * If Promise is supported by browser natively,
 * Don't parse it to let parsing time be short.
 * (es6-promise always load, whether Promise is supported or not.)
 */
require('../../../bower_components/es6-promise/promise.js');
require('../../../bower_components/fetch/fetch.js');
require('../../../bower_components/d3/d3.js');
require('./util.js');

API = require('../model/API.js');

var Router = require('./Router.js'),
	HomePageController = require('../controller/HomePageController.js'),
	SettingPageController = require('../controller/SettingPageController.js'),
	ServiceWorkerManager = require('./ServiceWorkerManager.js');

router = new Router();

router.addRoutes([{
	path: /^(\/index\.html)?$/,
	redirect: '/'
}, {
	path: /^\/$/,
	controller: HomePageController
}, {
	path: /^\/setting$/,
	controller: SettingPageController
}]);

router.on('beforetransition', function(from, to) {
	//Toggle SidePane when it is small device
	if (window.innerWidth <= 1080) {
		document.getElementById('SidePaneToggler').checked = false;
	}


	//SideMenu
	var selected = document.querySelector('.is-selected');
	if (selected) {
		selected.classList.remove('is-selected');
	}
	switch (to.constructor) {
		case SettingPageController:
			document.getElementById('settingPageLink').classList.add('is-selected');
			break;
	}
});

ServiceWorkerManager.pRegisterServiceWorker();
