(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        gravity: Math.PI * 0.5,

        init: function () {

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

            var self = this,
                p = this.player;
            Matter.Events.on(engine, "collisionStart", function (col) {
                col.pairs.forEach(function (o) {
                    if (o.bodyA === p.p || o.bodyB === p.p) {
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

            this.initMatter(engine);
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
            World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, -offset, _sceneWidth + 0.5, 50.5, { isStatic: true }));
            World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, _sceneHeight + offset, _sceneWidth + 0.5, 50.5, { isStatic: true }));
            World.addBody(_world, Bodies.rectangle(_sceneWidth + offset, _sceneHeight * 0.5, 50.5, _sceneHeight + 0.5, { isStatic: true }));
            World.addBody(_world, Bodies.rectangle(-offset, _sceneHeight * 0.5, 50.5, _sceneHeight + 0.5, { isStatic: true }));

            
            World.addBody(_world, Bodies.polygon(_sceneWidth * 0.5, _sceneWidth * 0.5, 6, 25));
            World.addBody(_world, Bodies.circle(_sceneWidth * 0.5, _sceneWidth * 0.1, 23));

            var a1 = Bodies.rectangle(80, _sceneHeight - 80, 240, 20, { isStatic: true });
            Matter.Body.rotate(a1, Math.PI / 4);
            World.addBody(_world, a1);

            for (var i = 0; i < 11; i++) {
                World.addBody(_world, 
                    Bodies.rectangle(
                        Ω.utils.rand(_sceneWidth),
                        Ω.utils.rand(_sceneHeight), 
                        Ω.utils.rand(30, 250), 
                        Ω.utils.rand(30, 250), 
                        { isStatic: true }));
            }

            //World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.38, _sceneHeight - 140, 250, 20, { isStatic: true }));
            //World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.6, _sceneHeight * 0.5, 250, 20, { isStatic: true }));
            //World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, 50, 100, 65, { isStatic: true }));

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

            this.syncGravity();
        },

        syncGravity: function () {
            this.engine.world.gravity.x = Math.cos(this.gravity);
            this.engine.world.gravity.y = Math.sin(this.gravity);
        },

        tick: function () {
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

            this.clear(gfx, "hsl(195, 40%, 5%)");

            this.player.render(gfx);

            c.strokeStyle = "hsl(210, 50%, 20%)";
            this.rains.forEach(function (r) {
                c.beginPath();
                c.moveTo(r.x, r.y);
                c.lineTo(r.x + (this.xo * 10), r.y + (this.yo * 10));
                c.stroke();
                //c.fillRect(r.x, r.y, 2, 2);
                //c.fillRect(r.x + (this.xo * 2), r.y + (this.yo * 2), 2, 2);
                //c.fillRect(r.x + (this.xo * 4), r.y + (this.yo * 4), 2, 2);
            }, this);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
