var EventDispatcher = require('../util/EventDispatcher.js');

function Behavior(){
    EventDispatcher.apply(this, arguments);
}
inheritClass(Behavior, EventDispatcher);

module.exports = Behavior;
