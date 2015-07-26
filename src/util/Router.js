/**
 * @TODO too fat
 */

var EventDispatcher = require('./EventDispatcher.js');

function Router() {
	EventDispatcher.apply(this, arguments);

	/**
	 * route list
	 * @type {Array}
	 */
	this.routes_ = [];

	/**
	 * controller
	 * @type {PageController}
	 */
	this.currentElement = null;

	window.addEventListener('popstate', this.onPopState = this.onPopState.bind(this));
	window.addEventListener('click', this.onClick = this.onClick.bind(this));
	once(window, 'load', this.checkRoute, this);
}
inheritClass(Router, EventDispatcher);

Router.prototype.onClick = function(ev) {
	var target = ev.target;

	if (ev.metaKey) return;

	while (target !== document.body) {
		if (target.tagName === 'A' ||
			target.getAttribute('target') === 'spa' ||
			target.getAttribute('href')) {
			ev.preventDefault();
			ev.stopPropagation();
			this.navigate(target.getAttribute('href'));
			return;
		}

		target = target.parentNode;
	}
};

Router.prototype.addRoutes = function(routes) {
	this.routes_ = this.routes_.concat(routes);
};

Router.prototype.onPopState = function(ev) {
	this.checkRoute();
};

Router.prototype.setRouteConfig = function(routes) {
	this.routes_ = this.routes_.concat(routes);
};

Router.prototype.checkRoute = function() {
	var routes = this.routes_,
		path = location.pathname,
		i, ma, from, to, self, route;

	for (i = 0; i < routes.length; i = (i + 1) | 0) {
		if (!(ma = routes[i].path.test(path))) continue;
		route = routes[i];
		if (route === this.currentRoute) return;

		if (route.redirect) {
			return this.redirect(route.redirect);
		} else {
			from = this.currentElement;
			to = route.element;
			self = this;

			if (typeof to === 'string') {
				to = route.element = document.querySelector(route.element);
			}

			this.fire('beforetransition', from, to)

			return Promise
				.all([
					from ? from.pBeforeLeavePage() : Promise.resolve(),
					to.pBeforeEnterPage()
				])
				.then(function() {
					return from ? from.pLeavePage() : Promise.resolve();
				})
				.then(function() {
					return to.pEnterPage();
				})
				.then(function() {
					self.currentController = to;
					return Promise.all([
						from ? from.pAfterLeavePage() : Promise.resolve(),
						to.pAfterEnterPage()
					]);
				})
				.then(function(){
					self.fire('aftertransition', from, to);
					self.currentElement = route.element;
				})
				.catch(function(e) {
					console.error(e);
				})
		}
	}
};

Router.prototype.redirect = function(path) {
	history.replaceState(null, null, path);
	this.checkRoute();
};

Router.prototype.navigate = function(path) {
	history.pushState(null, null, path);
	this.checkRoute();
};

module.exports = Router;
