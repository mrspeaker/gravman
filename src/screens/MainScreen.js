(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        gravity: Math.PI * 0.5,

        gamepadFound: false,

        loaded: false,

        init: function () {

            var self = this;

            new Ω.SVGLevel("res/levels/level00.svg?rnd=" + Date.now(), "#Page-1", function (level, err) {
                if (err) {
                    console.log("Error loading surface:", err);
                    return;
                }

                self.level = level;
                self.init2();
                self.loaded = true;
            });

        },

        init2: function () {

            this.player = new Player(100, 100, this);

            this.Engine = Matter.Engine;
            this.World = Matter.World;

            data.physics = data.physics_space;

            this.rains = [];
            for (var i = 0; i < 50; i++) {
                this.rains.push({
                    x: Ω.utils.rand(Ω.env.w),
                    y: Ω.utils.rand(Ω.env.h)
                })
            }

            var engine = this.engine = Matter.Engine.create(
                document.getElementById('phys'), 
                {

                   /* positionIterations: 6,
                    velocityIterations: 4,
                    enableSleeping: false*/
                    render: {
                        options: {  
                            width: Ω.env.w,
                            height: Ω.env.h
                        }
                    },
                    world: {
                        bounds: { 
                            min: { x: 0, y: 0 }, 
                            max: { x: Ω.env.w, y: Ω.env.h } 
                        }
                    }
                });

            Matter.Engine.run(engine);

            Matter.Events.on(engine, "afterTick", function () {
                game.tick();
                game.render(Ω.gfx);
            });


            this.addPhysicsCollisionHandler(engine);

            this.initMatter(engine);
        },

        initGamepad: function () {

            if (this.gamepad || !navigator.getGamepads() || !(navigator.getGamepads()[0])) return false;

            this.gamepad = navigator.getGamepads()[0];

            return true;

        },

        initMatter: function (engine) {

            var p = this.player.p = Matter.Bodies.polygon(this.player.x, this.player.y, 6, 25);
        
            Matter.World.clear(engine.world);
            Matter.Engine.clear(engine);
            Matter.World.add(engine.world, p);

            var World = Matter.World,
                _sceneWidth = Ω.env.w,
                _sceneHeight = Ω.env.h,
                Bodies = Matter.Bodies,
                _world = engine.world,
                offset = 5;
            //World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, -offset, _sceneWidth + 0.5, 50.5, { isStatic: true }));
            //World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, _sceneHeight + offset, _sceneWidth + 0.5, 50.5, { isStatic: true }));
            //World.addBody(_world, Bodies.rectangle(_sceneWidth + offset, _sceneHeight * 0.5, 50.5, _sceneHeight + 0.5, { isStatic: true }));
            //World.addBody(_world, Bodies.rectangle(-offset, _sceneHeight * 0.5, 50.5, _sceneHeight + 0.5, { isStatic: true }));

            var polyman = Bodies.polygon(_sceneWidth * 0.5, _sceneWidth * 0.5, 6, 25),
                circleman = Bodies.circle(_sceneWidth * 0.5, _sceneWidth * 0.1, 23);           
            //circleman.frictionAir = 0.01;
            //polyman.frictionAir = 0.00001;
            [polyman, circleman].map(function (b) {
             //   World.addBody(_world, b);
            });

            /*for (var i = 0; i < 11; i++) {
                World.addBody(_world, 
                    Bodies.rectangle(
                        Ω.utils.rand(_sceneWidth),
                        Ω.utils.rand(_sceneHeight), 
                        Ω.utils.rand(30, 250), 
                        Ω.utils.rand(30, 250), 
                        { isStatic: true }));
            }*/

            var level = this.level,
                bg = level.layer("bg");
            bg.data.forEach(function (r) {
                var body = Bodies.rectangle(
                        r.x + (r.w / 2) - bg.x,
                        r.y + (r.h / 2) - bg.y, 
                        r.w, 
                        r.h,
                        { isStatic: true });
                if (r.rot) {
                    Matter.Body.rotate(body, r.rot * (Math.PI / 180));
                }
                World.addBody(_world, body);
            }, this);

            level.layer("falling").data.forEach(function (r) {
                var body;
                if (r.type === "polygon") {
                    body = Bodies.polygon(r.x, r.y, r.sides, 25);
                } else if (r.type === "rectangle") {
                    body = Bodies.rectangle(r.x, r.y, r.w, r.h);
                } else {
                    console.log(r)
                }
                World.addBody(_world, body);
            }, this);

            var renderOptions = engine.render.options;
            renderOptions.wireframes = true;
            renderOptions.hasBounds = false;
            renderOptions.showDebug = false;
            renderOptions.showBroadphase = false;
            renderOptions.showBounds = false;
            renderOptions.showVelocity = false;
            renderOptions.showCollisions = true;
            renderOptions.showAxes = false;
            renderOptions.showPositions = false;
            renderOptions.showAngleIndicator = false;//true;
            renderOptions.showIds = false;
            renderOptions.showShadows = false;
            renderOptions.background = 'rgba(0,0,0,0)';
            renderOptions.wireframeBackground = 'rgba(0,0,0,0)';
            renderOptions.wireframeColor = 'rgba(0,0,0,1)';

            this.syncGravity();
        },

        addPhysicsCollisionHandler: function (engine) {

            var self = this,
                p = this.player;

            Matter.Events.on(engine, "collisionStart", function (col) {
                col.pairs.forEach(function (o) {
                    if (o.bodyB === p.p || o.bodyA === p.p) {
                        //console.log(o.collision.normal, o.collision.tangent)
                        self.gravity = Math.atan2(o.collision.normal.y, o.collision.normal.x);
                        self.gravity = self.gravity < 0 ? self.gravity += 2 * Math.PI : self.gravity;
                        self.syncGravity();
                    }
                });
            });

            /*Matter.Events.on(engine, "collisionEnd", function (col) {
                ol.pairs.forEach(function (o) {
                    if (o.bodyA === p || o.bodyB === p) {

                    });
                });
            });*/


        },

        syncGravity: function () {
            this.engine.world.gravity.x = Math.cos(this.gravity);
            this.engine.world.gravity.y = Math.sin(this.gravity);
        },

        tick: function () {

            if (this.initGamepad() || this.gamepad) {
                var gp = navigator.getGamepads()[0];
                if (!Ω.input.isDown("up") && gp.buttons[0].pressed) {
                    Ω.input.trigger("up");
                } else if (Ω.input.isDown("up") && !(gp.buttons[0].pressed) ) {
                    Ω.input.release("up");
                }

                if (!Ω.input.isDown("left") && gp.axes[0] < -0.5) {
                    Ω.input.trigger("left");
                } else if (Ω.input.isDown("left") && gp.axes[0] > -0.5) {
                    Ω.input.release("left");
                }

                if (!Ω.input.isDown("right") && gp.axes[0] > 0.5) {
                    Ω.input.trigger("right");
                } else if (Ω.input.isDown("right") && gp.axes[0] < 0.5) {
                    Ω.input.release("right");
                }
            }

            this.player.tick(this.engine);

            var gravity = this.gravity,
                xo = Math.cos(gravity),
                yo = Math.sin(gravity);

            this.rains = this.rains.map(function (r) {
                r.x += xo * 6.0;
                r.y += yo * 6.0;

                if (xo < 0 && r.x < 0) r.x += Ω.env.w;
                if (xo > 0 && r.x > Ω.env.w) r.x -= Ω.env.w;
                if (yo < 0 && r.y < 0) r.y += Ω.env.h;
                if (yo > 0 && r.y > Ω.env.h) r.y -= Ω.env.h;
                return r;
            });

            this.xo = xo;
            this.yo = yo;

        },

        render: function (gfx) {
            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 75%)");

            this.player.render(gfx);

            // Some rain
            c.strokeStyle = "hsl(210, 50%, 20%)";
            this.rains.forEach(function (r) {
                c.beginPath();
                c.moveTo(r.x, r.y);
                c.lineTo(r.x + (this.xo * 10), r.y + (this.yo * 10));
                c.stroke();
            }, this);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
