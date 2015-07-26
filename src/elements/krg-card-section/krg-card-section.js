var CardSectionPrototype = Object.create(HTMLElement.prototype),
    template;

CardSectionPrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot(),
        self = this;

    template = template || document.querySelector('template[name="krg-card-section"]');

    shadowRoot.appendChild(document.importNode(template.content, true));

    this.$ = {
        header: shadowRoot.getElementById('header')
    };

    this.updateTitle();
};

CardSectionPrototype.updateTitle = function(){
    var title = this.getAttribute('title');
    if (title) {
        this.$.header.textContent = title;
        this.$.header.style.display = '';
    } else {
        this.$.header.style.display = 'none';
    }
};

CardSectionPrototype.attributeChangedCallback = function(name, oldVal, newVal){
    switch (name) {
        case 'title':
            this.updateTitle();
            break;
    }
};

module.exports = document.registerElement('krg-card-section', {
    prototype: CardSectionPrototype
});
