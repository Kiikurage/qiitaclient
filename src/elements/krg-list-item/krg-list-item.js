var ListItemPrototype = Object.create(HTMLLIElement.prototype),
	template;

ListItemPrototype.createdCallback = function() {
	var shadowRoot = this.createShadowRoot(),
		self = this;

	template = template || document.querySelector('template[name="krg-list-item"]');

	shadowRoot.appendChild(document.importNode(template.content, true));

	this.$ = {};
};

module.exports = document.registerElement('krg-list-item', {
	prototype: ListItemPrototype
});
