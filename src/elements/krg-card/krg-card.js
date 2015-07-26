var CardPrototype = Object.create(HTMLElement.prototype),
    template;

CardPrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot();

    template = template || document.querySelector('template[name="krg-card"]');

    shadowRoot.appendChild(document.importNode(template.content, true));

    this.$ = {
        inner: shadowRoot.getElementById('#inner')
    };
};

module.exports = document.registerElement('krg-card', {
    prototype: CardPrototype
});
