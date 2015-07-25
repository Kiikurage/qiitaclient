var PageController = require('./PageController.js'),
	PageView = require('../view/PageView.js');

var CardView = require('../view/CardView.js'),
	CardSectionView = require('../view/CardSectionView.js');

/**
 * Setting Page Controller
 * @constructor
 */
function HomePageController(){
	var page = PageView.initWithQuery('#homePage');
    PageController.call(this, page);

	var section = CardSectionView.initWithTemplate();

	for (var i = 0; i < 20; i++) {
		var card = CardView.initWithTemplate();
		var p = document.createElement('p');
		p.classList.add('CardView__row');
		p.textContent = 'Click Me!';
		card.appendChild(p);
		section.appendChild(card);
	}

	this.views.base.appendChild(section);
}
inheritClass(HomePageController, PageController);

module.exports = HomePageController;
