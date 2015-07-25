var View = require('./View.js');

function CardSectionView(base){
    View.apply(this, arguments);

    extend(this.$, {
        title: base.querySelector('.CardSectionView__header')
    });
}
inheritClass(CardSectionView, View);

CardSectionView.prototype.setTitle = function(newVal) {
    if (newVal) {
        this.$.title.style.display = '';
    } else {
        this.$.title.style.display = 'none';
    }
    this.$.title.textContent = newVal;
};

CardSectionView.prototype.getTitle = function() {
    return this.$.title.textContent;
};

module.exports = CardSectionView;
