var API = require('../../model/API.js');

var SidePaneUserBoxPrototype = Object.create(HTMLElement.prototype),
	template;

SidePaneUserBoxPrototype.createdCallback = function() {
	var shadowRoot = this.createShadowRoot(),
		self = this;

	template = template || document.querySelector('template[name="krg-sidepane-userbox"]');

	shadowRoot.appendChild(document.importNode(template.content, true));

	this.$ = {
		authorized: shadowRoot.getElementById('authorized'),
		unauthorized: shadowRoot.getElementById('unauthorized'),
		icon: shadowRoot.getElementById('icon'),
        userId: shadowRoot.getElementById('userId'),
        contributionCount: shadowRoot.getElementById('contributionCount'),
        followerCount: shadowRoot.getElementById('followerCount'),
        followCount: shadowRoot.getElementById('followCount'),
    };

    API.pInit()
        .then(function(){
            return API.pGet('/authenticated_user')
        })
        .then(function(user){
			self.setUser(user);
        });

	this.update();
};

SidePaneUserBoxPrototype.setUser = function(user) {
	this.user = user;
	this.update();
};

SidePaneUserBoxPrototype.update = function() {
	var user = this.user,
		$ = this.$;

	if (user) {
		$.authorized.classList.remove('is-hide');
		$.unauthorized.classList.add('is-hide');
		$.icon.src = user.profile_image_url;
		$.userId.textContent = user.id;
		$.contributionCount.textContent = 0;
		$.followerCount.textContent = user.followers_count;
		$.followCount.textContent = user.followees_count;
	} else {
		$.authorized.classList.add('is-hide');
		$.unauthorized.classList.remove('is-hide');
		$.icon.src = '';
		$.userId.textContent = '';
		$.contributionCount.textContent = '';
		$.followerCount.textContent = '';
		$.followCount.textContent = '';
	}
};

module.exports = document.registerElement('krg-sidepane-userbox', {
	prototype: SidePaneUserBoxPrototype
});
