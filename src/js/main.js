(function(){
    "use strict";

    //====================================================================//
    // require
    //====================================================================//

    var THREE = require('./lib/three');
    //var TWEEN = require('./lib/Tween');
    var dat = require('./lib/dat.gui');
    var utils = require('./utils');
    var ThreeApp = require('./ThreeApp');
    var Toroidy = require('./toroidy');

    //====================================================================//
    // globals
    //====================================================================//

    var DEBUG = true;

    var app, gui
     ,  params = { scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0 }
     ;

    //====================================================================//
    // main()
    //====================================================================//

    module.exports.main = function() {

        app = new ThreeApp({ onRender: animate, onInit: init });

        if (DEBUG) {
            window.THREE = THREE;
            window.threeApp = app;
        }

        //init_dat_gui();
        utils.preventDefaultTouchEvents();
    };

    //====================================================================//
    // more functions
    //====================================================================//

    function init(app) {

        app.toroidy = new Toroidy.Model(app, 3, 3, { //4, 11, {
            //ringSpacing: 30,
            //segmentMarginOutFactor: 2.3
        }); //3, 7);  //3, 5);

        app.scene.add(app.toroidy.object3d);
        app.toroidy.object3d.position.y = 150;

        if (DEBUG) console.debug('Toroidy.Model', app.toroidy);
    }

    function animate(time) {

        var obj3d = app.toroidy.object3d;
        if (obj3d) {
            obj3d.scale.x = params.scaleX;
            obj3d.scale.y = params.scaleY;
            obj3d.scale.z = params.scaleZ;

            obj3d.rotation.x = -0.6;
            obj3d.rotation.z += 0.005;
        }
    }

    function init_dat_gui() {
        gui = new dat.GUI({
            height: 3 * 32 - 1
        });

        gui.add(params, 'scaleX').min(0.1).max(5.0).name('Scale X');
        gui.add(params, 'scaleY').min(0.1).max(5.0).name('Scale Y');
        gui.add(params, 'scaleZ').min(0.1).max(5.0).name('Scale Z');
    }

})();
