(function(){
    "use strict";

    var THREE = require('../lib/three');

    var Segment = function(ring, degreeBegin, degreeEnd) {

        //var margin = ((degreeEnd - degreeBegin) * ring.model.options.segmentMargin) / 2.0;

        var innerFactor = (((ring.center - ring.halfWidth) - ring.model.options.ringInnerRadius) / ring.model.radiusRange) * ring.model.options.segmentMarginOutFactor;
        var margin = ((degreeEnd - degreeBegin) * ((innerFactor * ring.model.options.segmentMargin) + ring.model.options.segmentMargin)) / 2.0;
        var outerFactor = (((ring.center + ring.halfWidth) - ring.model.options.ringInnerRadius) / ring.model.radiusRange) * ring.model.options.segmentMarginOutFactor;
        var outerMargin = ((degreeEnd - degreeBegin) * ((outerFactor * ring.model.options.segmentMargin) + ring.model.options.segmentMargin)) / 2.0;

        Object.defineProperties(this, {
            ring: { value: ring },
            model: { value: ring.model },
            degreeBegin: { value: degreeBegin },
            degreeInnerBegin: { value: degreeBegin + margin },
            degreeInnerOuterBegin: { value: degreeBegin + outerMargin },
            degreeEnd: { value: degreeEnd },
            degreeInnerEnd: { value: degreeEnd - margin },
            degreeInnerOuterEnd: { value: degreeEnd - outerMargin }
        });

        createShapePoints(this);
        createGeometry(this);
        createMesh(this);

        console.debug('Segment', this);
    };

    var DEG2RAD = Math.PI / 180.0;

    function createShapePoints(seg) {
        seg.shapePoints = [];

        var divisions = seg.model.options.segmentDivision;
        var innerSpread = (seg.degreeInnerEnd - seg.degreeInnerBegin) / divisions;
        var i, x, y, r;

        r = seg.ring.center - seg.ring.halfWidth;
        for (i = 0; i < divisions+1; i++) {
            x = r * Math.cos((seg.degreeInnerBegin + (i * innerSpread)) * DEG2RAD);
            y = r * Math.sin((seg.degreeInnerBegin + (i * innerSpread)) * DEG2RAD);
            seg.shapePoints.push(new THREE.Vector2(x, y));
        }

        var innerSpread = (seg.degreeInnerOuterEnd - seg.degreeInnerOuterBegin) / divisions;
        r = seg.ring.center + seg.ring.halfWidth;
        for (i = divisions; i >= 0; i--) {
            x = r * Math.cos((seg.degreeInnerOuterBegin + (i * innerSpread)) * DEG2RAD);
            y = r * Math.sin((seg.degreeInnerOuterBegin + (i * innerSpread)) * DEG2RAD);
            seg.shapePoints.push(new THREE.Vector2(x, y));
        }
    }

    function createGeometry(seg) {
        seg.shape = new THREE.Shape(seg.shapePoints);
        seg.geometry = new THREE.ShapeGeometry(seg.shape);
    }

    function createMesh(seg) {
        seg.mesh = new THREE.Mesh(seg.geometry,
                new THREE.MeshBasicMaterial({ color: 0xfffff0 }));
        seg.meshWireframe = new THREE.Mesh(seg.geometry,
                new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true }));
    }

    module.exports = Segment;
})();