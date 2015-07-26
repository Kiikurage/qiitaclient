var ButtonPrototype = Object.create(HTMLButtonElement.prototype),
    template;

ButtonPrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot();

    template = template || document.querySelector('template[name="krg-button"]');

    shadowRoot.appendChild(document.importNode(template.content, true));

    this.$ = {
    };
};

module.exports = document.registerElement('krg-button', {
    prototype: ButtonPrototype
});
