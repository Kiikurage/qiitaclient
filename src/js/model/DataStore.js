var Model = require('./Model.js');

/**
 * DataStore fetch API and stores all data.
 * @NOTE This class is singleton.
 * @constructor
 */
function DataStore(){
    if (this.constructor.instance_) throw Error('DataStore: singleton constructor is called more than once.');
    this.constructor.instance_ = this;

    Model.apply(this, arguments);
}
inheritClass(DataStore, Model);

/**
 * Singleton instance.
 * @type {DataStore}
 * @private
 */
DataStore.instance_ = null;

/**
 * get instance.
 * @return {DataStore} instance
 */
DataStore.getInstance = function(){
    return this.instance_ || new this();
};

module.exports = DataStore;
