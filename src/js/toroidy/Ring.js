(function(){
    "use strict";

    var Segment = require('./Segment');

    var Ring = function(model, center) {

        Object.defineProperties(this, {
            model: { value: model },
            halfWidth: { value: model.options.ringWidth / 2.0 },
            center: { value: center },
            segColOffset: { value: (Math.random() * model.segmentCount)|0 }
        });

        createSegments(this, model);

        //console.debug('=> new Ring', this);
    };

    function createSegments(ring, model) {
        var segCount = model.segmentCount;
        var segSpread = 360.0 / segCount;
        var col;
        ring.segments = new Array(segCount);
        for (var i=0; i < segCount; i++) {
            col = model.options.segmentColors[(ring.segColOffset + i)%model.segmentCount];
            ring.segments[i] = new Segment(ring, i*segSpread, (i+1)*segSpread, col);
        }
    }

    module.exports = Ring;
})();
