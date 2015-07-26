var HeaderPanelPrototype = Object.create(HTMLElement.prototype),
    template;

HeaderPanelPrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot();

    template = template || document.querySelector('template[name="krg-headerpanel"]');

    shadowRoot.appendChild(document.importNode(template.content, true));

    this.$ = {
    };
};

module.exports = document.registerElement('krg-headerpanel', {
    prototype: HeaderPanelPrototype
});
