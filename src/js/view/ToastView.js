var View = require('./View.js');

function ToastView(base){
    View.apply(this, arguments);

    /**
     * auto-close timer id
     * @type {number|null}
     * @private
     */
    this.timerId_ = null;

    this.initialize_();
}
inheritClass(ToastView, View);

/**
 * Initialize
 * @private
 */
ToastView.prototype.initialize_ = function(){
    extend(this.$, {
        message: this.$.base.querySelector('.ToastView__message')
    });

    this.$.base.addEventListener('click', this.onClick_ = this.onClick_.bind(this));
};

/**
 * show view.
 * @param {string} message shown message
 * @param {number} duration duration by auto closing
 */
ToastView.prototype.show = function(message, duration){
    var self = this,
        duration = duration || 3000;

    if (self.timerId_) {
        clearTimeout(self.timerId_);
        self.timerId_ = null;
    }

    this.$.message.textContent = message;
    this.$.base.classList.add('is-show');

    this.timerId_ = setTimeout(function(){
        self.timerId_ = null;
        self.hide();
    }, duration);
};

/**
 * hide view.
 */
ToastView.prototype.hide = function(){
    if (self.timerId_) {
        clearTimeout(self.timerId_);
        self.timerId_ = null;
    }

    this.$.base.classList.remove('is-show');
};

ToastView.prototype.onClick_ = function(ev){
    this.fire('click');
    this.hide();
};

module.exports = ToastView;
