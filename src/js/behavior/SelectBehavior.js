var Behavior = require('./Behavior.js');

/**
 * Abstract Class to select item in many items
 * @constructor
 */
function SelectBehavior(base){
    Behavior.apply(this, arguments);

    this.$ = {
        base: base,
        items: []
    };

    /**
     * selected index
     * @type {number}
     */
    this.selectedIndex_ = -1;

    this.$.base.addEventListener('click', this.onClick_ = this.onClick_.bind(this));
}
inheritClass(SelectBehavior, Behavior);

var CLASS_SELECT = 'is-selected';

//------------------------------------------------------------------------------
// Properties
//

SelectBehavior.prototype.getSelectedIndex = function(){
    return this.selectedIndex_;
};

SelectBehavior.prototype.setSelectedIndex = function(newVal){
    var oldVal = this.getSelectedIndex(),
        oldItem = this.$.items[oldVal],
        newItem = this.$.items[newVal];

    if (!newItem || oldVal === newVal) return;

    if (oldItem) {
        oldItem.classList.remove(CLASS_SELECT);
    }

    newItem.classList.add(CLASS_SELECT);
    this.selectedIndex_ = newVal;

    this.fire('change', this.getTextContent(), newVal, oldVal);
};

SelectBehavior.prototype.getSelectedItem = function(){
    return this.$.items[this.getSelectedIndex()] || null;
};

SelectBehavior.prototype.setSelectedItem = function(newVal) {
    return this.setSelectedIndex(this.$.items.indexOf(newVal));
};

SelectBehavior.prototype.getTextContent = function(){
    var selectedItem = this.getSelectedItem();
    return selectedItem ? selectedItem.textContent.trim() : null;
};

//------------------------------------------------------------------------------
// Methods
//

/**
 * Add new item to the end.
 * @param {Element|Array<Element>} item item
 */
SelectBehavior.prototype.addItem = function(item){
    if (item instanceof Array) {
        this.$.items.push.apply(this.$.items, item);
    } else {
        this.$.items.push(item);
    }
};

/**
 * remove item.
 * @param {Element|Array<Element>} item item
 */
SelectBehavior.prototype.removeItem = function(item){
    if (item instanceof Array) {
        return item.forEach(function(item){
            this.removeItem(item);
        }, this);
    } else {
        var i = this.$.items.indexOf(item);
        if (i > -1) {
            this.$.items.splice(i, 1);
        }
    }
};

//------------------------------------------------------------------------------
// Event Listeners
//

/**
 * Event listener handling list.click
 * @private
 */
SelectBehavior.prototype.onClick_ = function(ev){
    var target = ev.target,
        base = this.$.base,
        items = this.$.items

    while (target) {
        if (items.indexOf(target) !== -1) break;

        target = target.parentNode;
        if (target === base) {
            target = null;
            break;
        }
    }
    if (!target) return;

    this.setSelectedItem(target);
};

module.exports = SelectBehavior;
