var DocListPrototype = Object.create(HTMLElement.prototype),
	template;

DocListPrototype.createdCallback = function() {
	var shadowRoot = this.createShadowRoot(),
		self = this;

	template = template || document.querySelector('template[name="krg-doc-list"]');

	shadowRoot.appendChild(document.importNode(template.content, true));

	this.$ = {
		container: shadowRoot.getElementById('container')
	};

	this.updateTitle();
};

DocListPrototype.setDocs = function(docs) {
    var container = this.$.container
		children = container.children;

    while (children.length < docs.length) {
        container.appendChild(document.createElement('krg-doc-card'));
    }
    while (children.length > docs.length) {
        container.removeChild(container.lastElementChild);
    }

    arraySlice(children).forEach(function(card, i){
        card.setDoc(docs[i]);
    });
};

DocListPrototype.updateTitle = function() {
	this.$.container.setAttribute('title', this.getAttribute('title') || '');
};

DocListPrototype.attributeChangedCallback = function(name, oldVal, newVal) {
	switch (name) {
		case 'title':
			this.updateTitle();
			break;
	}
};

module.exports = document.registerElement('krg-doc-list', {
	prototype: DocListPrototype
});
