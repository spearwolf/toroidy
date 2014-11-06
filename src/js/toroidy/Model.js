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


    var Model = function(app, ringCount, segmentCount, _options) {

        this.options = Object.freeze(utils.makeOptions(_options, DEFAULT_OPTIONS));

        //console.log('Toroidy.Model, rings=', ringCount, 'segments=', segmentCount, "options=", this.options);

        Object.defineProperties(this, {
            app: {
                value: app
            },
            ringCount: {
                value: ringCount
            },
            segmentCount: {
                value: segmentCount
            },
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

        createRings(this);

        //app.domElement.addEventListener('mousedown', onTap.bind(this, this), false);
        app.hammer.on('tap', onTap.bind(this, this));
    };

    function onTap(model, event) {
        //console.debug('tap!', model, event);
        try {

            var vector = new THREE.Vector3();
            vector.set((event.center.x / model.app.width) * 2 - 1, - (event.center.y / model.app.height) * 2 + 1, 0.5);
            vector.unproject(model.app.camera);

            model.raycaster.ray.set(model.app.camera.position, vector.sub(model.app.camera.position).normalize());

            var intersects = model.raycaster.intersectObjects(model.interactiveObjects);
            if (intersects.length > 0) {
                event.preventDefault();
                //console.debug('intersects=', intersects[0]);
                var obj = intersects[0].object.toroidySegment;
                if (obj) {
                    obj.onTap();
                }
            //} else {
                //console.debug('.. you clicked on nothing!');
            }

        } catch (err) {
            console.error(err);
        }
    }

    Model.prototype.addAllMeshsTo = function(scene) {
        this.rings.forEach(function(ring) {
            ring.segments.forEach(function(seg) {
                scene.add(seg.mesh);
                //scene.add(seg.meshWireframe);
            });
        });
    };

    function createRings(model) {
        model.rings = new Array(model.ringCount);
        var radius = model.options.ringInnerRadius;
        var halfWidth = model.options.ringWidth / 2.0;
        for (var i=0; i < model.ringCount; i++) {
            model.rings[i] = new Ring(model, radius + halfWidth);
            radius += model.options.ringWidth + model.options.ringSpacing;
        }
    }

    module.exports = Model;
})();
