var View = require('./View.js');

function CardView(base) {
	View.apply(this, arguments);

	this.$.base.addEventListener('click', this.onClick = this.onClick.bind(this));

	this.originalWidth = null;
	this.originalHeight = null;

	this.isOpen = false;
    this.isAnimating = false;
}
inheritClass(CardView, View);

CardView.prototype.pZoomIn = function() {
	var base = this.$.base,
		inner = this.$.base.querySelector('.CardView__inner');

	var baseGcr = base.getBoundingClientRect(),
        innerGcr = inner.getBoundingClientRect();

	this.originalWidth = innerGcr.width;
	this.originalHeight = innerGcr.height;

	base.classList.add('is-zoomIn');
    base.style.width = baseGcr.width+'px';
    base.style.height = baseGcr.height+'px';
	inner.style.transition = '0.18s ease-in';

	return pAnimateOnce(inner, function() {
			inner.style.transform = 'translate(0, -8px)';
			inner.style.width = innerGcr.width + 'px';
			inner.style.height = innerGcr.height + 'px'
		})
		.then(function() {
			inner.style.transition = '0.28s ease-in-out';
			return pWait();
		})
		.then(function(){
		    return pAnimateOnce(inner, function(){
		        inner.style.transform = 'translate(-'+innerGcr.left+'px, -'+innerGcr.top+'px)';
		        inner.style.height = window.innerHeight + 'px';
		        inner.style.width = window.innerWidth + 'px';
		    });
		})
		.catch(function(e) {
			console.error(e);
		});
};

CardView.prototype.pZoomOut = function() {
	var self = this,
		base = this.$.base,
		inner = this.$.base.querySelector('.CardView__inner');

	var gcr = inner.getBoundingClientRect();

	inner.style.transition = '0.28s ease-in-out';

	return pAnimateOnce(inner, function() {
			inner.style.transform = 'translate(-' + gcr.left + 'px, -8px)';
			inner.style.height = self.originalHeight + 'px';
			inner.style.width = self.originalWidth + 'px';
		})
		.then(function() {
			inner.style.transition = '0.18s ease-in';
			return pWait();
		})
		.then(function() {
			base.classList.remove('is-zoomIn');
			return pAnimateOnce(inner, function() {
				inner.style.transform = 'translate(0, 0px)';
			});
		})
		.then(function() {
			inner.style.transform = '';
			inner.style.width = '';
			inner.style.height = '';
			inner.style.transition = '';
			return pWait();
		})
		.catch(function(e) {
			console.error(e);
		});
};

CardView.prototype.onClick = function() {
	var self = this;
    if (this.isAnimating) return;
    this.isAnimating = true;

	if (!this.isOpen) {
		this.pZoomIn()
			.then(function() {
				console.log('OK');
				self.isOpen = true;
                self.isAnimating = false;
			});
	} else {
		this.pZoomOut()
			.then(function() {
				console.log('OK');
				self.isOpen = false;
                self.isAnimating = false;
			});
	}
};

module.exports = CardView;
