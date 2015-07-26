var DatePrototype = Object.create(HTMLElement.prototype),
    template;

DatePrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot(),
        self = this;

    template = template || document.querySelector('template[name="krg-date"]');

    shadowRoot.appendChild(document.importNode(template.content, true));
};

function getDateDiff(from) {
    return Date.now() - from;
}

function getDateDiffText(from) {
    var diff = getDateDiff(from);

    diff /= 1000;
    if (diff < 10) return '数秒前';

    diff /= 60;
    if (diff < 60) return parseInt(diff) + '分前';

    diff /= 60;
    if (diff < 24) return parseInt(diff) + '時間前';

    diff /= 24;
    if (diff < 30) return parseInt(diff) + '日前';

    return from.getFullYear() + '/'
        + (from.getMonth()+1) + '/'
        + (from.getDate());
}

DatePrototype.getDate = function() {
    return new Date(this.getAttribute('value'));
};

DatePrototype.update = function(){
    var val = this.getDate();

    this.textContent = getDateDiffText(val);
};

DatePrototype.attributeChangedCallback = function(name, oldVal, newVal){
    switch (name) {
        case 'value':
            this.update();
            break;
    }
};

module.exports = document.registerElement('krg-date', {
    prototype: DatePrototype
});
