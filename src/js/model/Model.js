var EventDispatcher = require('../util/EventDispatcher.js');

function Model(){
    EventDispatcher.apply(this, arguments);
}
inheritClass(Model, EventDispatcher);

module.exports = Model;
