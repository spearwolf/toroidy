(function(){
    "use strict";

    var THREE = require('../lib/three');
    var utils = require('../utils');
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

    //==================================================================//
    // public methods
    //==================================================================//

    Ring.prototype.rotateAroundAxis = function(axis, degree) {
        var obj3dMatrix = this.restoreObject3dMatrix;
        if (!obj3dMatrix) {
            obj3dMatrix = this.object3d.matrix;
        }
        var rotMatrix = new THREE.Matrix4();
        rotMatrix.makeRotationAxis(axis.normalize(), degree * utils.DEG2RAD);
        //rotMatrix.multiply(this.object3d.matrix);
        rotMatrix.multiply(obj3dMatrix);
        this.object3d.matrix = rotMatrix;
        this.object3d.rotation.setFromRotationMatrix(this.object3d.matrix);
    };

    Ring.prototype.saveObject3dMatrix = function() {
        this.restoreObject3dMatrix = this.object3d.matrix.clone();
    };

    module.exports = Ring;

})();
