var Template = module.exports;

var templateMap = {};

var container;

/**
 * load all <template /> tag
 * @private
 */
Template.load_ = function(){
    arraySlice(document.querySelectorAll('template'))
        .forEach(function($tmpl){
            var id = $tmpl.dataset.id;
            if (id) {
                templateMap[id] = $tmpl.innerHTML;
            }
        });
};

Template.create = function(id) {
    var template = templateMap[id];
    if (!template) {
        throw Error('Template \''+id+'\' is not found.');
    }

    if (typeof template === 'string') {
        if (!container) {
            container = document.createElement('div');
        }
        container.innerHTML = template;
        templateMap[id] = template = container.firstElementChild;
    }

    return template.cloneNode(true);
};

window.addEventListener('DOMContentLoaded', Template.load_);
