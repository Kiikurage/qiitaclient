var View = require('./View.js');

function PageView(base){
    View.apply(this, arguments);
}
inheritClass(PageView, View);

/**
 * fade in
 */
PageView.prototype.pEnterPage = function(){
    var base = this.$.base;

    base.classList.add('is-display');

	return pWait()
        .then(function(){
            return pAnimateOnce(base, function() {
                base.classList.add('is-fadeIn');
        	});
        })
};

/**
 * fade out
 *
 * @NOTE
 * When the page is fade out, at same time,
 * fade in next page on front of the fade-out-page.
 * So, it need not to change opacity.
 */
PageView.prototype.pLeavePage = function(){
    var base = this.$.base;

	return pAnimateOnce(base, function() {
            base.classList.remove('is-fadeIn');
        })
        .then(function(){
            base.classList.remove('is-display');
        });
};

module.exports = PageView;
