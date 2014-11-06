(function(){
    "use strict";

    var Segment = require('./Segment');

    var Ring = function(model, center) {

        Object.defineProperties(this, {
            model: {
                value: model
            },
            halfWidth: {
                value: model.options.ringWidth / 2.0
            },
            center: {
                value: center
            }
        });

        createSegments(this, model);

        console.debug('=> new Ring', this);
    };

    function createSegments(ring, model) {
        var segCount = model.segmentCount;
        var segSpread = 360.0 / segCount;
        ring.segments = new Array(segCount);
        for (var i=0; i < segCount; i++) {
            ring.segments[i] = new Segment(ring, i*segSpread, (i+1)*segSpread);
        }
    }

    module.exports = Ring;
})();
