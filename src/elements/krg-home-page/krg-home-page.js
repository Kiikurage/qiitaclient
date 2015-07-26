var Page = require('../krg-page/krg-page.js'),
	HomePagePrototype = Object.create(Page.prototype),
	template;

HomePagePrototype.createdCallback = function() {
	var shadowRoot = this.createShadowRoot();

	template = template || document.querySelector('template[name="krg-home-page"]');

	shadowRoot.appendChild(document.importNode(template.content, true));

	this.$ = {
		docList: shadowRoot.querySelector('krg-doc-list')
	};
};

HomePagePrototype.pLoadDocs = function() {
	var self = this;

	return API.pGet('/items', {
			'page': 1,
			'per_page': 100
		})
		.then(function(docs) {
			self.$.docList.setDocs(docs);
		});
};

HomePagePrototype.pAfterEnterPage = function() {
	this.pLoadDocs();
	return Promise.resolve();
};

module.exports = document.registerElement('krg-home-page', {
	prototype: HomePagePrototype
});
