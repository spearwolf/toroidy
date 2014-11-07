(function(){
    "use strict";

    var utils = require('../utils');
    var Ring = require('./Ring');
    var THREE = require('../lib/three');

    var DEFAULT_OPTIONS = {

        ringInnerRadius: 100,
        ringWidth: 140,
        ringSpacing: 70,
        segmentMargin: 0.3, //0.4,
        segmentMarginOutFactor: -0.7,
        segmentDivision: 16,

        segmentColors: [
            0xB58900,
            0xCB4B16,
            0xDC322F,
            0xD33682,
            0x6C71C4,
            0x268BD2,
            0x2AA198,
            0x859900,
            0x657B83,
            0x93A1A1,
            0x073642
        ]
    };

    //==================================================================//
    // Model constructor
    //==================================================================//

    var Model = function(app, ringCount, segmentCount, _options) {

        this.options = Object.freeze(utils.makeOptions(_options, DEFAULT_OPTIONS));

        Object.defineProperties(this, {
            app: { value: app },
            ringCount: { value: ringCount },
            segmentCount: { value: segmentCount },
            outerRadius: {
                value: this.options.ringInnerRadius + (ringCount * (this.options.ringWidth + this.options.ringSpacing))
            }
        });

        Object.defineProperties(this, {
            radiusRange: {
                value: this.outerRadius - this.options.ringInnerRadius
            }
        });

        this.raycaster = new THREE.Raycaster();
        this.interactiveObjects = [];

        this.object3d = new THREE.Object3D();

        createRings(this);
    };

    //==================================================================//
    // public methods
    //==================================================================//

    Model.prototype.tap = function(event) {

        var vector = new THREE.Vector3();
        vector.set(
            (event.center.x / this.app.width) * 2 - 1,
            -(event.center.y / this.app.height) * 2 + 1,
            0.5 );
        vector.unproject(this.app.camera);

        this.raycaster.ray.set(
            this.app.camera.position,
            vector.sub(this.app.camera.position).normalize() );

        var intersects = this.raycaster.intersectObjects(this.interactiveObjects);

        if (intersects.length > 0) {
            event.preventDefault();

            var obj = intersects[0].object.toroidySegment;
            if (obj) obj.onTap();
        }
    };

    Model.prototype.destroy = function() {
        if (this.rings) {
            this.rings.forEach(function(ring) {
                ring.destroy();
            });
            delete this.rings;
        }
        if (this.object3d) {
            this.app.scene.remove(this.object3d);
            //this.object3d.dispose();
            delete this.object3d;
        }
    };


    //==================================================================//
    // private functions
    //==================================================================//

    function createRings(model) {
        model.rings = new Array(model.ringCount);
        var radius = model.options.ringInnerRadius;
        var halfWidth = model.options.ringWidth / 2.0;
        for (var i=0; i < model.ringCount; i++) {
            model.rings[i] = new Ring(model, radius + halfWidth, "r"+i);
            radius += model.options.ringWidth + model.options.ringSpacing;
        }
    }


    module.exports = Model;
})();
