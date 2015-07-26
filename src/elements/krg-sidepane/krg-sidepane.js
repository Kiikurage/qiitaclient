var SidePanePrototype = Object.create(HTMLElement.prototype),
    template;

SidePanePrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot(),
        self = this;

    template = template || document.querySelector('template[name="krg-sidepane"]');

    shadowRoot.appendChild(document.importNode(template.content, true));

    this.$ = {
        inner: shadowRoot.getElementById('inner'),
        toggler: shadowRoot.getElementById('toggler')
    };

    this.$.toggler.addEventListener('click', function(){
        self.pClose();
    });
};

SidePanePrototype.pOpen = function(){
    var self = this;
    return pAnimateOnce(this.$.inner, function(){
        self.setAttribute('open', '');
    });
};

SidePanePrototype.pClose = function(){
    var self = this;
    return pAnimateOnce(this.$.inner, function(){
        self.removeAttribute('open');
    });
};

SidePanePrototype.toggle = function(){
    if (this.hasAttribute('open')) {
        return this.pClose();
    } else {
        return this.pOpen();
    }
};

module.exports = document.registerElement('krg-sidepane', {
    prototype: SidePanePrototype
});
