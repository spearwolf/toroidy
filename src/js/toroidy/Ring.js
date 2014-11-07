(function(){
    "use strict";

    var THREE = require('../lib/three');
    var Segment = require('./Segment');

    //==================================================================//
    // Ring constructor
    //==================================================================//

    var Ring = function(model, center, id) {

        Object.defineProperties(this, {
            id: { value: id },
            model: { value: model },
            halfWidth: { value: model.options.ringWidth / 2.0 },
            center: { value: center },
            segColOffset: { value: (Math.random() * model.segmentCount)|0 }
        });

        this.object3d = new THREE.Object3D();
        model.object3d.add(this.object3d);

        createSegments(this, model);
    };

    //==================================================================//
    // private functions
    //==================================================================//

    function createSegments(ring, model) {
        var segCount = model.segmentCount;
        var segSpread = 360.0 / segCount;
        var col, sid;

        ring.segments = new Array(segCount);

        for (var i=0; i < segCount; i++) {
            col = model.options.segmentColors[(ring.segColOffset + i)%model.segmentCount];
            sid = ring.id + "s" + i;
            ring.segments[i] = new Segment(ring, i*segSpread, (i+1)*segSpread, col, sid);
        }
    }


    module.exports = Ring;

})();
