var Page = require('../krg-page/krg-page.js'),
    SettingPagePrototype = Object.create(Page.prototype),
    template;

SettingPagePrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot();

    template = template || document.querySelector('template[name="krg-setting-page"]');

    shadowRoot.appendChild(document.importNode(template.content, true));

	this.$ = {
        logoutCard: shadowRoot.getElementById('logoutCard'),
        loginCard: shadowRoot.getElementById('loginCard'),
		loginState: shadowRoot.getElementById('loginState')
	};
};


SettingPagePrototype.pBeforeEnterPage = function(){
	var self = this;

    API.pInit()
        .then(function(){
            return API.pGet('/authenticated_user')
        })
        .then(function(user){
			self.$.loginState.textContent = user.id;
            self.setAttribute('state', 'logined');
        })
		.catch(function(){
			self.$.loginState.textContent = 'ログインしていません。';
            self.setAttribute('state', 'logouted');
		});

	return Promise.resolve();
};


module.exports = document.registerElement('krg-setting-page', {
    prototype: SettingPagePrototype
});
