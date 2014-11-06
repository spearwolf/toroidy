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
            console.debug("hej toroidy");
        }

        //init_dat_gui();
        utils.preventDefaultTouchEvents();
    };

    //====================================================================//
    // more functions
    //====================================================================//

    function init(app) {

        app.toroidy = new Toroidy.Model(3, 7);  //3, 5);

        app.mesh = new THREE.Object3D();
        app.toroidy.addAllMeshsTo(app.mesh);
        app.scene.add(app.mesh);

        app.mesh.position.y = 150;


        if (DEBUG) console.info('Toroidy.Model', app.toroidy);

        //var geometry = new THREE.BoxGeometry(400, 400, 400);
        //var material = new THREE.MeshBasicMaterial({
            //color: 0xffffaa,
            //wireframe: true,
            //wireframeLinewidth: 2*app.DPR
        //});

        //app.mesh = new THREE.Mesh(geometry, material);
        //app.scene.add(app.mesh);
    }

    function animate(time) {

        if (app.mesh) {
            app.mesh.scale.x = params.scaleX;
            app.mesh.scale.y = params.scaleY;
            app.mesh.scale.z = params.scaleZ;

            app.mesh.rotation.x = -0.6;
            //app.mesh.rotation.y += 0.02;
            app.mesh.rotation.z += 0.005;
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
