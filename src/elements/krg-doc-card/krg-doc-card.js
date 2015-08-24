var Card = require('../krg-card/krg-card.js'),
	DocCardPrototype = Object.create(Card.prototype),
	template;

DocCardPrototype.createdCallback = function() {
	var shadowRoot = this.createShadowRoot(),
		self = this;

	template = template || document.querySelector('template[name="krg-doc-card"]');

	shadowRoot.appendChild(document.importNode(template.content, true));

	this.$ = {
		userIcon: shadowRoot.getElementById('userIcon'),
		userId: shadowRoot.getElementById('userId'),
		update: shadowRoot.getElementById('update'),
		title: shadowRoot.getElementById('title'),
		tagContainer: shadowRoot.getElementById('tagContainer')
	};
};

DocCardPrototype.setDoc = function(doc) {
	var $ = this.$;

	if (doc) {
		$.userIcon.src = doc['user']['profile_image_url']
		$.userId.textContent = doc['user']['id'];
		$.update.setAttribute('value', doc['updated_at']);
		$.title.textContent = doc['title'];
		$.tagContainer.innerHTML = '<span>' +
			doc['tags']
			.map(function(tag) {
				return tag.name;
			})
			.join('</span><span>') +
			'</span>';
	} else {
		$.userIcon.src = '';
		$.userId.textContent = '';
		$.update.setAttribute('value', '');
		$.title.textContent = '';
		$.tagContainer.innerHTML = '';
	}
};

module.exports = document.registerElement('krg-doc-card', {
	prototype: DocCardPrototype
});
