/**
 * shortcut of Array.prototype.slice.call
 */
arraySlice = Function.prototype.call.bind(Array.prototype.slice);

/**
 * inherit class
 * @param {Function} child child class constructor
 * @param {Function} parent parent class constructor
 * @global
 * @NOTE Object.create is supported by almost all browser.(in IE, 9 and after support.)
 * @ref http://kangax.github.io/compat-table/es5/#Object.create
 */
inheritClass = function(child, parent) {
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = child;
	extend(child, parent);
};

/**
 * extend object (shallow copy only)
 * @param {Object} target target object
 * @param {Object...} sources srouce objects
 * @return extended target object
 */
extend = function(target) {
	var sources = arraySlice(arguments, 1);

	sources.forEach(function(source) {
		if (!source) return;

		Object.keys(source).forEach(function(key) {
            target[key] = source[key];
		})
	});

    return target;
};

/**
 * key codes
 * @enum {number}
 */
KeyCode = {
	UP: 38,
	DOWN: 40
};

/**
 * wait for animationend
 */
pAnimateOnce = function(target, fn) {
	return new Promise(function(resolve, reject){
		var proxy = function(ev){
			if (ev.target !== target) return;
			target.removeEventListener('transitionend', proxy);
			resolve();
		}
		target.addEventListener('transitionend', proxy);
		fn();
	});
};

once = function(target, type, fn, context) {
	var proxy = function(){
		target.removeEventListener(type, proxy);
		fn.apply(context||this,arguments);
	};
	target.addEventListener(type, proxy);
};

pWait = function(){
	return new Promise(function(resolve, reject){
		requestAnimationFrame(function() {
			requestAnimationFrame(function() {
				resolve();
			});
		});
	});
}
