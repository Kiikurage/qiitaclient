var View = require('./View.js'),
    SelectBehavior = require('../behavior/SelectBehavior.js');

function DropDownView(base){
    View.apply(this, arguments);

    extend(this.$, {
        value: this.$.base.querySelector('.DropDownView__value'),
        list: this.$.base.querySelector('.DropDownView__list'),
        items: arraySlice(this.$.base.querySelectorAll('.DropDownView__item'), 0)
    });

    this.selectBehavior = new SelectBehavior(this.$.list);
    this.selectBehavior.addItem(this.$.items);
    this.selectBehavior.on('change', this.onSelectChange_, this);

    /**
     * selected index
     * @type {number}
     * @private
     */
    this.selectedIndex_ = -1;
    this.setSelectedIndex(this.$.items.indexOf(this.$.base.querySelector('.DropDownView__item.is-selected')));
}
inheritClass(DropDownView, View);

//------------------------------------------------------------------------------
// Properties
//

DropDownView.prototype.getSelectedIndex = function(){
    return this.selectedIndex_;
};

DropDownView.prototype.setSelectedIndex = function(newVal) {
    this.selectBehavior.setSelectedItem(this.$.items[newVal]);
};

DropDownView.prototype.getTextContent = function(){
    return this.selectBehavior.getTextContent();
};

//------------------------------------------------------------------------------
// Methods
//

/**
 * Add new item to the end.
 * @param {string} text text
 * @return {number} inserted index
 */
DropDownView.prototype.addItem = function(text){
    return this.insertItem(text, this.$.items.length);
};

/**
 * Add new item to the specified index
 * @param {string} text text
 * @param {number} index inserted index
 * @return {number} inserted index
 */
DropDownView.prototype.insertItem = function(text, index) {
    if (index < 0) {
        insertedIndex = 0
    }

    var list = this.$.list,
        items = this.$.items,
        newItem = document.createElement('li'),
        insertedIndex = index < 0 ? 0 :
                        index > items.length ? items.length : index;

    newItem.classList.add('DropDownView__item');
    newItem.textContent = text;

    if (insertedIndex < items.length) {
        list.insertBefore(newItem, items[insertedIndex]);
        items.splice(insertedIndex, 0, newItem);
    } else {
        list.appendChild(newItem);
        items.push(newItem);
    }

    this.selectBehavior.addItem(newItem);
    return insertedIndex;
};

//------------------------------------------------------------------------------
// Event Listener

DropDownView.prototype.onSelectChange_ = function(textContent, newVal, oldVal) {
    this.$.value.textContent = textContent;
    this.$.base.blur();
    this.fire('change', textContent, newVal, oldVal);
};

module.exports = DropDownView;
