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
	this.$.container.addEventListener('click', this.onClick.bind(this));
	this.addEventListener('click', function(ev){
		console.log(ev);
	});

	this.updateTitle();
};

DocListPrototype.onClick = function(ev){
	var path = ev.path,
		container = this.$.container,
 		offset = path.indexOf(container)-1,
		target = path[offset];

	while (!(target instanceof HTMLElement) || target instanceof HTMLContentElement) {
		offset--;
		if (offset <= -1) {
			target = null;
			break;
		}
		target = path[offset];
	}
	if (!target) {
		return;
	}

	var index = Array.prototype.indexOf.call(this.$.container.children, target);

	ev.stopImmediatePropagation();
	this.dispatchEvent(new CustomEvent('click', {
		detail: {
			index: index,
			targe: target
		}
	}));
	// console.log(index, target);
}

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
