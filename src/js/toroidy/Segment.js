(function(){
    "use strict";

    var THREE = require('../lib/three');
    var TWEEN = require('../lib/Tween');
    var DEG2RAD = require('../utils').DEG2RAD;

    //==================================================================//
    // Segment constructor
    //==================================================================//

    var Segment = function(ring, degreeBegin, degreeEnd, baseColor, id) {

        var innerFactor = (((ring.center - ring.halfWidth) - ring.model.options.ringInnerRadius) / ring.model.radiusRange) * ring.model.options.segmentMarginOutFactor;
        var margin = ((degreeEnd - degreeBegin) * ((innerFactor * ring.model.options.segmentMargin) + ring.model.options.segmentMargin)) / 2.0;
        var outerFactor = (((ring.center + ring.halfWidth) - ring.model.options.ringInnerRadius) / ring.model.radiusRange) * ring.model.options.segmentMarginOutFactor;
        var outerMargin = ((degreeEnd - degreeBegin) * ((outerFactor * ring.model.options.segmentMargin) + ring.model.options.segmentMargin)) / 2.0;

        Object.defineProperties(this, {
            id: { value: id },
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

        ring.object3d.add(this.mesh);
        ring.model.interactiveObjects.push(this.mesh);

        createRingRotationAxis(this);
    };

    //==================================================================//
    // private functions
    //==================================================================//

    function createRingRotationAxis(seg) {
        var a = new THREE.Vector3(
                seg.ring.center * Math.cos(seg.degreeBegin * DEG2RAD),
                seg.ring.center * Math.sin(seg.degreeBegin * DEG2RAD),
                0 );
        seg.ringRotationAxis = new THREE.Vector3(
                seg.ring.center * Math.cos(seg.degreeEnd * DEG2RAD),
                seg.ring.center * Math.sin(seg.degreeEnd * DEG2RAD),
                0 );
        seg.ringRotationAxis.sub(a);
    }

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
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                }));

        seg.mesh.toroidySegment = seg;
    }

    function createRingRotationTween(seg) {
        var tween = new TWEEN.Tween({ degree: 0 })
            .to({ degree: 180.0 })
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(function() {
                seg.ring.rotateAroundAxis(seg.ringRotationAxis, this.degree);
            })
            .onComplete(function() {
                seg.ring.hasTween = false;
                seg.ring.saveObject3dMatrix();
                seg.ring.segments.forEach(function(_seg) {
                    _seg.ringRotationAxis.applyAxisAngle(seg.ringRotationAxis, 180.0 * DEG2RAD);
                });
            })
            ;
        seg.ring.saveObject3dMatrix();
        seg.ring.hasTween = true;
        tween.start();
    }

    //==================================================================//
    // public methods
    //==================================================================//

    Segment.prototype.rotateRing = function() {
        if (!this.ring.hasTween) {
            createRingRotationTween(this);
        }
    };

    Segment.prototype.onTap = function() {
        console.debug('you tapped on me ->', this);
        
        this.rotateRing();
    };


    module.exports = Segment;

})();
