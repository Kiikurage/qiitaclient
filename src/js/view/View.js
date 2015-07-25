var EventDispatcher = require('../util/EventDispatcher.js'),
    Template = require('../util/Template.js');

function View(base){
    EventDispatcher.apply(this, arguments);

    this.$ = {
        base: base,
        container: base.hasAttribute('container') ?
                    base :
                    base.querySelector('[container]')
    };

    if (!this.$.container) {
        throw new Error('container element is not found.');
    }
}
inheritClass(View, EventDispatcher);

/**
 * Initialize instance with the template.
 * @return {View} initialized instance
 */
View.initWithTemplate = function() {
    return new this(Template.create(this.name));
};

/**
 * Initialize instance with the element matched specified query.
 * @param {string} query CSS selector query
 * @return {View} initialized instance
 */
View.initWithQuery = function(query) {
    return new this(document.querySelector(query));
};

/**
 * Initialize instance with all elements matched specified query.
 * @param {string} query CSS selector query
 * @return {Array<View>} initialized instances
 */
View.initWithQueryAll = function(query) {
    return arraySlice(document.querySelectorAll(query))
        .map(function(element){
            return new this(element);
        }, this);
};

View.prototype.appendChild = function(child){
    if (child instanceof View) {
        child = child.$.base;
    }

    this.$.container.appendChild(child);
};

View.prototype.appendTo = function(parent){
    if (parent instanceof View) {
        parent = parent.$.container;
    }

    parent.appendChild(this.$.base);
};

View.prototype.removeChild = function(child){
    if (child instanceof View) {
        child = child.$.base;
    }

    this.$.container.removeChild(child);
};

module.exports = View;
