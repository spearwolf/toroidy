(function(){
    "use strict";

    var preventDefault = function(event) {
        event.preventDefault();
    };

    module.exports.preventDefaultTouchEvents = function(elem) {
        if (!elem) elem = document.body;
        //elem.addEventListener('touchstart', preventDefault, false);
        elem.addEventListener('touchmove', preventDefault, false);
    };

    module.exports.makeOptions = function(options, defaultOptions) {
        if (!options) {
            return defaultOptions;
        } else {
            var opts = Object.create(defaultOptions);
            for (var k in options) {
                if (options.hasOwnProperty(k)) {
                    opts[k] = options[k];
                }
            }
            return opts;
        }
    };

})();
