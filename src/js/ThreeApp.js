(function(){
    "use strict";

    var THREE = require('./lib/three');
    var TWEEN = require('./lib/Tween');
    var Stats = require('./lib/Stats');
    var Hammer = require('./lib/hammer');
    var utils = require('./utils');

    var DEFAULT_OPTIONS = {
        showStats: true,
        statsCssClass: 'stats',
        alpha: true,
        autoClear: true,
        onInit: null,
        onResize: null,
        onRender: null
    };

    var ThreeApp = function(options) {

        options = utils.makeOptions(options, DEFAULT_OPTIONS);

        this.scene = new THREE.Scene();

        Object.defineProperty(this, 'renderer', {
            value: new THREE.WebGLRenderer({ alpha: options.alpha })
        });

        this.renderer.autoClear = options.autoClear;

        if (options.onResize) this.onResize = options.onResize;
        if (options.onRender) this.onRender = options.onRender;
        if (options.onInit) this.onInit = options.onInit;

        this.resize();
        window.addEventListener('resize', this.resize.bind(this), false);

        document.body.appendChild(this.renderer.domElement);

        this.hammer = new Hammer(this.renderer.domElement);

        if (options.showStats) {
            this.stats = new Stats();
            this.stats.setMode(0); // 0: fps, 1: ms

            var el = this.stats.domElement;
            if (options.statsCssClass) el.classList.add(options.statsCssClass);
            document.body.appendChild(el);
        }

        if ('function' === typeof this.onInit) {
            this.onInit(this);
        }

        requestAnimationFrame(this.render.bind(this));
    };

    ThreeApp.prototype.resize = function() {
        var w = window.innerWidth
          , h = window.innerHeight
          ;

        if (!this.camera) {
            this.camera = new THREE.PerspectiveCamera(75, w / h, 1, 10000);
            this.camera.position.z = 1000;
            this.camera.createdByThreeApp = true;
        } else if (this.camera.createdByThreeApp) {
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        }

        this.renderer.setSize(w, h);

        Object.defineProperties(this, {
            width: {
                configurable: true,
                value: w
            },
            height: {
                configurable: true,
                value: h
            }
        });

        if ('function' === typeof this.onResize) {
            this.onResize(w, h, this);
        }
    };

    ThreeApp.prototype.render = function(time) {
        requestAnimationFrame(this.render.bind(this));

        if (this.stats) this.stats.begin();

        if ('function' === typeof this.onRender) {
            this.onRender(time, this);
        }

        TWEEN.update(time);

        this.renderer.render(this.scene, this.camera);

        if (this.stats) this.stats.end();
    };

    Object.defineProperties(ThreeApp.prototype, {
        DPR: {
            value: window.devicePixelRatio || 1
        },
        domElement: {
            get: function() { return this.renderer.domElement; }
        }
    });

    module.exports = ThreeApp;
})();
