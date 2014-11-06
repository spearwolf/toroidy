(function(){
    "use strict";

    var THREE = require('../lib/three');
    var DEG2RAD = require('../utils').DEG2RAD;

    var Segment = function(ring, degreeBegin, degreeEnd, baseColor) {

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
            degreeInnerOuterEnd: { value: degreeEnd - outerMargin },
            baseColor: { value: baseColor }
        });

        createShapePoints(this);
        createGeometry(this);
        createMesh(this);

        //console.debug('Segment', this);
    };

    Segment.prototype.onTap = function() {
        console.debug('you tapped on me ->', this);
    };

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

        innerSpread = (seg.degreeInnerOuterEnd - seg.degreeInnerOuterBegin) / divisions;
        r = seg.ring.center + seg.ring.halfWidth;
        for (i = divisions; i >= 0; i--) {
            x = r * Math.cos((seg.degreeInnerOuterBegin + (i * innerSpread)) * DEG2RAD);
            y = r * Math.sin((seg.degreeInnerOuterBegin + (i * innerSpread)) * DEG2RAD);
            seg.shapePoints.push(new THREE.Vector2(x, y));
        }
    }

    function createGeometry(seg) {
        var shape = new THREE.Shape(seg.shapePoints);
        seg.geometry = new THREE.ShapeGeometry(shape);
    }

    function createMesh(seg) {
        seg.mesh = new THREE.Mesh(seg.geometry,
                new THREE.MeshBasicMaterial({
                    color: seg.baseColor /*0x333333*/,
                    transparent: true,
                    opacity: 0.8
                }));

        seg.mesh.toroidySegment = seg;
        seg.model.interactiveObjects.push(seg.mesh);
    }

    module.exports = Segment;
})();
