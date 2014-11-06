(function(){
    "use strict";

    var utils = require('../utils');
    var Ring = require('./Ring');

    var DEFAULT_OPTIONS = {
        ringInnerRadius: 100,
        ringWidth: 140,
        ringSpacing: 70,
        segmentMargin: 0.4,
        segmentMarginOutFactor: -0.8,
        segmentDivision: 16
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
