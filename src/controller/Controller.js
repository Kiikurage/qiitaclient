var EventDispatcher = require('../util/EventDispatcher.js');

function Controller(){
    EventDispatcher.apply(this, arguments);
}
inheritClass(Controller, EventDispatcher);

module.exports = Controller;
