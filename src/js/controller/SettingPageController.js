var PageController = require('./PageController.js'),
	PageView = require('../view/PageView.js');

/**
 * Setting Page Controller
 * @constructor
 */
function SettingPageController(){
	var page = PageView.initWithQuery('#settingPage');
    PageController.call(this, page);
}
inheritClass(SettingPageController, PageController);

module.exports = SettingPageController;
