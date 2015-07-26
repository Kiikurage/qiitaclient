var PagePrototype = Object.create(HTMLElement.prototype),
    template;

PagePrototype.createdCallback = function(){
    var shadowRoot = this.createShadowRoot();

    template = template || document.querySelector('template[name="krg-page"]');

    shadowRoot.appendChild(document.importNode(template.content, true));

    this.$ = {};
};


PagePrototype.pBeforeLeavePage = function(){
    return Promise.resolve();
};

PagePrototype.pLeavePage = function(){
    return this.pFadeOut();
};

PagePrototype.pAfterLeavePage = function(){
    return Promise.resolve();
};

PagePrototype.pBeforeEnterPage = function(){
    return Promise.resolve();
};

PagePrototype.pEnterPage = function(){
    return this.pFadeIn();
};

PagePrototype.pAfterEnterPage = function(){
    return Promise.resolve();
};

/**
 * fade in
 */
PagePrototype.pFadeIn = function(){
    var self = this;

    self.classList.add('is-display');

	return pWait()
        .then(function(){
            return pAnimateOnce(self, function() {
                self.classList.add('is-fadeIn');
        	});
        })
};

/**
 * fade out
 */
PagePrototype.pFadeOut = function(){
    var self = this;

	return pAnimateOnce(self, function() {
            self.classList.remove('is-fadeIn');
        })
        .then(function(){
            self.classList.remove('is-display');
        });
};

module.exports = document.registerElement('krg-page', {
    prototype: PagePrototype
});
