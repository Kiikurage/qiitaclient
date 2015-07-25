var EventDispatcher = require('../util/EventDispatcher.js'),
    PageView = require('../view/PageView.js');

/**
 * Page Controller base class.
 * @constructor
 */
function PageController(base){
    EventDispatcher.apply(this, arguments);

    this.views = {
        base: base
    };
}
inheritClass(PageController, EventDispatcher);

/**
 * initialize with CSS query
 * @param {string} query CSS query
 * @return {PageController} initialized instance.
 */
PageController.initWithQuery = function(query){
    return new this(PageView.initWithQuery(query));
};

/**
 * fade in
 */
PageController.prototype.pEnterPage = function(){
    return this.views.base.pEnterPage();
};

/**
 * fade out
 */
PageController.prototype.pLeavePage = function(){
    return this.views.base.pLeavePage();
};

/**
 * call before leave from this page
 * @param {PageController} to page enter to
 */
PageController.prototype.pBeforeLeavePage = function(to){
    // should be overriden by subclass
    return Promise.resolve();
};

/**
 * call after leave from this page
 * @param {PageController} to page enter to
 */
PageController.prototype.pAfterLeavePage = function(to){
    // should be overriden by subclass
    return Promise.resolve();
};

/**
 * call before enter to this page
 * @param {PageController} from page left from
 */
PageController.prototype.pBeforeEnterPage = function(from){
    // should be overriden by subclass
    return Promise.resolve();
};

/**
 * call after enter to this page
 * @param {PageController} from page left from
 */
PageController.prototype.pAfterEnterPage = function(from){
    // should be overriden by subclass
    return Promise.resolve();
};

module.exports = PageController;
