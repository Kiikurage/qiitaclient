require('../elements/krg-button/krg-button.js');
require('../elements/krg-card/krg-card.js');
require('../elements/krg-card-section/krg-card-section.js');
require('../elements/krg-date/krg-date.js');
require('../elements/krg-doc-card/krg-doc-card.js');
require('../elements/krg-doc-list/krg-doc-list.js');
require('../elements/krg-headerpanel/krg-headerpanel.js');
require('../elements/krg-home-page/krg-home-page.js');
require('../elements/krg-icon/krg-icon.js');
require('../elements/krg-list/krg-list.js');
require('../elements/krg-list-item/krg-list-item.js');
require('../elements/krg-nav/krg-nav.js');
require('../elements/krg-page/krg-page.js');
require('../elements/krg-setting-page/krg-setting-page.js');
require('../elements/krg-sidepane/krg-sidepane.js');
require('../elements/krg-sidepane-userbox/krg-sidepane-userbox.js');

require('./util.js');

API = require('../model/API.js');

var Router = require('./Router.js'),
	ServiceWorkerManager = require('./ServiceWorkerManager.js');

var router = new Router();

//ルーティング
router.addRoutes([{
	path: /^(\/index\.html)?$/,
	redirect: '/'
}, {
	path: /^\/$/,
	element: 'krg-home-page'
}, {
	path: /^\/stock\/?$/,
	element: '#stockPage'
}, {
	path: /^\/setting\/?$/,
	element: 'krg-setting-page'
}]);

//ページ遷移時の処理
router.on('beforetransition', function(from, to) {
	//Toggle SidePane
	document.querySelector('krg-sidepane').pClose();
});

ServiceWorkerManager.pRegisterServiceWorker();
