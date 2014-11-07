(function(){
    "use strict";

    //====================================================================//
    // require
    //====================================================================//

    var THREE = require('./lib/three');
    var Hammer = require('./lib/hammer');
    var utils = require('./utils');
    var ThreeApp = require('./ThreeApp');
    var Toroidy = require('./toroidy');

    //====================================================================//
    // globals
    //====================================================================//

    var DEBUG = true;
    var app;

    //====================================================================//
    // main()
    //====================================================================//

    module.exports.main = function() {

        app = new ThreeApp({ onRender: animate, onInit: init });

        if (DEBUG) {
            window.THREE = THREE;
            window.threeApp = app;
        }

        utils.preventDefaultTouchEvents();
    };

    //====================================================================//
    // more functions
    //====================================================================//

    function init(app) {

        app.createToroidy = function() {
            if (app.toroidy) app.toroidy.destroy();

            app.toroidy = new Toroidy.Model(app, 4, 5, { //4, 11, {
                ringSpacing: 30,
                segmentMarginOutFactor: 1  //2.3
            }); //3, 7);  //3, 5);

            app.scene.add(app.toroidy.object3d);
            app.toroidy.object3d.position.y = 150;

            if (DEBUG) console.debug('Toroidy.Model', app.toroidy);
        };

        app.createToroidy();

        app.hammer.on('tap', function(event) {
            if (app.toroidy) app.toroidy.tap(event);
        });

        var toroidyReset = new Hammer(document.getElementById('toroidy-reset'));
        toroidyReset.on('tap', function(event) {
            event.preventDefault();
            app.createToroidy();
        });
    }

    function animate(time) {

        if (app.toroidy) {
            var obj3d = app.toroidy.object3d;
            obj3d.rotation.x = -0.6;
            obj3d.rotation.z += 0.005;
        }
    }

})();
