(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        gravity: Math.PI * 0.5,

        init: function () {

            this.player = new Player(100, 100);

            this.Engine = Matter.Engine;
            this.World = Matter.World;

            data.physics = data.physics_space;
            
            var engine = this.engine = Matter.Engine.create(
                document.getElementById('phys'), 
                {
                   /* positionIterations: 6,
                    velocityIterations: 4,
                    enableSleeping: false*/
                });

            Matter.Engine.run(engine);

            Matter.Events.on(engine, "afterTick", function () {
                game.tick();
                game.render(Ω.gfx);
            });

            var self = this;
            Matter.Events.on(engine, "collisionStart", function (col) {
                col.pairs.forEach(function (o) {
                    if (o.bodyA === self.p || o.bodyB === self.p) {
                        self.gravity = Math.atan2(-o.collision.normal.y, o.collision.normal.x);
                        self.syncGravity();
                    }
                });
            });

            this.initMatter(engine);
        },

        initMatter: function (engine) {

            var p = this.p = Matter.Bodies.polygon(100, 100, 6, 25);

        
            Matter.World.clear(engine.world);
            Matter.Engine.clear(engine);
            Matter.World.add(engine.world, p);

            var World = Matter.World,
                _sceneWidth = 800,
                _sceneHeight = 600,
                Bodies = Matter.Bodies,
                _world = engine.world,
                offset = 5;
            World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, -offset, _sceneWidth + 0.5, 50.5, { isStatic: true }));
            World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.5, _sceneHeight + offset, _sceneWidth + 0.5, 50.5, { isStatic: true }));
            World.addBody(_world, Bodies.rectangle(_sceneWidth + offset, _sceneHeight * 0.5, 50.5, _sceneHeight + 0.5, { isStatic: true }));
            World.addBody(_world, Bodies.rectangle(-offset, _sceneHeight * 0.5, 50.5, _sceneHeight + 0.5, { isStatic: true }));


            var lol = Bodies.rectangle(200, 200, 220, 20, { isStatic: true });
            Matter.Body.rotate(lol, Math.PI / 4);

            World.addBody(_world, lol);

            //engine.world.bounds.max.x = 500;
            //engine.world.bounds.max.y = 350;

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
            renderOptions.showAngleIndicator = true;
            renderOptions.showIds = false;
            renderOptions.showShadows = false;
            renderOptions.background = '#fff';

            this.syncGravity();
        },

        syncGravity: function () {
            this.engine.world.gravity.x = Math.cos(this.gravity);
            this.engine.world.gravity.y = -Math.sin(this.gravity);
        },

        tick: function () {
            this.player.tick();

            if (Math.random() < 0.01) {
                //this.gravity = Math.random() * (Math.PI * 2);
                //this.syncGravity();
            }

            var xf = this.p.force.x,
                yf = this.p.force.y,
                perp = this.gravity + (Math.PI / 2),
                px = Math.cos(perp),
                py = Math.sin(perp);

            if (Ω.input.pressed("up")) {
                xf -= (this.engine.world.gravity.x) / 20;
                yf -= (this.engine.world.gravity.y) / 20;
            }

            if (Ω.input.isDown("left")) {
                if(this.p.speed < 5) {
                    xf -= px * 0.005;
                    yf -= py * 0.005;
                }
            }
            if (Ω.input.isDown("right")) {
                if(this.p.speed < 5) {
                    xf += px * 0.005;
                    yf += py * 0.005;
                }
            }

            this.p.force.x = xf;
            this.p.force.y = yf;
        },

        render: function (gfx) {
            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 5%)");

            this.player.render(gfx);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
