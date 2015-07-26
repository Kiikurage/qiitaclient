var _ = module.exports;

var isWatching = false,
    isResizing = false,
    timreId = null;

var INTERVAL = 300;

_.init = function(interval){
    INTERVAL = interval || INTERVAL;
    window.addEventListener('resize', _.onResize)
};

_.onResize = function(){
    isResizing = true;

    if (isWatching) return;
    isWatching = true;

    timerId = setInterval(_.onWatch, INTERVAL);
    window.dispatchEvent(new Event('resizestart'));
};

_.onWatch = function(){
    if (isResizing) {
        isResizing = false;
    } else {
        clearInterval(timerId);
        timerId = null;
        isWatching = false;
        window.dispatchEvent(new Event('resizeend'));
    }
};
