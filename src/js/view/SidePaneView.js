var View = require('./View.js');

function SidePaneView(base) {
	View.apply(this, arguments);

	extend(this.$, {
        check: document.querySelector('.SidePaneView__toggler')
	});
}
inheritClass(SidePaneView, View);

/**
 * open side pane
 */
SidePaneView.prototype.pOpen = function() {
    var checkbox = this.$.check;

    if (checkbox.checked) return Promise.resolve();

    return pAnimateOnce(this.$.base, function(){
        checkbox.checked = true;
    });
};

/**
 * close side pane
 */
SidePaneView.prototype.pClose = function() {
    var checkbox = this.$.check;

    if (!checkbox.checked) return Promise.resolve();

    return pAnimateOnce(this.$.base, function(){
        checkbox.checked = false;
    });
};

/**
 * close side pane if Device is small width (like Smart-Phone)
 */
SidePaneView.prototype.pCloseIfSP = function(){
	if (window.innerWidth > 1080) {
		return Promise.resolve();
	} else {
		return this.pClose();
	}
};

module.exports = SidePaneView;
