var NavPrototype = Object.create(HTMLElement.prototype),
    template;

NavPrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot();

    template = template || document.querySelector('template[name="krg-nav"]');

    shadowRoot.appendChild(document.importNode(template.content, true));

    this.$ = {
    };
};

module.exports = document.registerElement('krg-nav', {
    prototype: NavPrototype
});
