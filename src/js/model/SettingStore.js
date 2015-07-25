var DataStore = require('./DataStore.js');

/**
 * Store user's setting
 * @constructor
 *
 * @TODO
 * more efficient method.
 * In current impelmentation, I use Local Storage.
 * Every time the value is changed, all values are saved
 * whether the value is changed or not.
 */
function SettingStore() {
	DataStore.apply(this, arguments);

    /**
     * the data
     * @type {Object}
     */
	this.data = {};

    this.load();
}
inheritClass(SettingStore, DataStore);

/**
 * the key of the localStorage.
 * @constant
 */
SettingStore.KEY = 'user_setting';

/**
 * save the data
 */
SettingStore.prototype.save = function(){
    var serialized = JSON.stringify(this.data);
    localStorage.setItem(SettingStore.KEY, serialized);
};

/**
 * load the data.
 *
 * @NOTE
 * When SettingStore is initialized, settings are loaded automatically.
 * So generaly, you need not to call SettingStore.load().
 */
SettingStore.prototype.load = function(){
    var serialized = localStorage.getItem(SettingStore.KEY);
    this.data = JSON.parse(serialized) || {};
};

module.exports = SettingStore;
