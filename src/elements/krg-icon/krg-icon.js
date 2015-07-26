var IconPrototype = Object.create(HTMLElement.prototype),
	template;

IconPrototype.createdCallback = function() {
	var shadowRoot = this.createShadowRoot(),
		self = this;

	template = template || document.querySelector('template[name="krg-icon"]');

	shadowRoot.appendChild(document.importNode(template.content, true));

	this.$ = {
		svg: shadowRoot.querySelector('svg')
	};

	this.importIcon();
};

IconPrototype.importIcon = function() {
	var iconId = this.getAttribute('icon');
	if (!iconId) return;

	var svg = this.$.svg,
		child;
	while (child = svg.firstElementChild) {
		svg.removeChild(child);
	}

	var icon = document.querySelector('#' + iconId);
	if (!icon) return;

	icon = icon.cloneNode(true);
	svg.appendChild(icon);
}

IconPrototype.attributeChangedCallback = function(name, oldVal, newVal) {
	switch (name) {
		case 'icon':
			this.importIcon();
			break;
	}
};

module.exports = document.registerElement('krg-icon', {
	prototype: IconPrototype
});
