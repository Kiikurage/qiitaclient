var ListPrototype = Object.create(HTMLElement.prototype),
	template;

ListPrototype.createdCallback = function() {
	var shadowRoot = this.createShadowRoot(),
		self = this;

	template = template || document.querySelector('template[name="krg-list"]');

	shadowRoot.appendChild(document.importNode(template.content, true));

	this.$ = {};
};

module.exports = document.registerElement('krg-list', {
	prototype: ListPrototype
});
