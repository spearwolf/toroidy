(function(){
    "use strict";

    var utils = require('../utils');
    var Ring = require('./Ring');

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

    var Model = function(ringCount, segmentCount, _options) {

        this.options = Object.freeze(utils.makeOptions(_options, DEFAULT_OPTIONS));

        console.log('Toroidy.Model, rings=', ringCount, 'segments=', segmentCount, "options=", this.options);

        Object.defineProperties(this, {
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

        createRings(this);
    };


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
