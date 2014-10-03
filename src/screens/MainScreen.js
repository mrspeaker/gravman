(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        gravity: Math.PI * 1.5,

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
                    if (o.bodyA === self.p || o.bodyB === self.player.p) {
                        self.gravity = Math.atan2(-o.collision.normal.y, o.collision.normal.x);
                        self.gravity = self.gravity < 0 ? self.gravity += 2 * Math.PI : self.gravity;
                        self.syncGravity();
                    }
                });
            });

            this.initMatter(engine);
        },

        initMatter: function (engine) {

            var p = this.player.p = Matter.Bodies.polygon(this.player.x, this.player.y, 6, 25);

        
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


            var a1 = Bodies.rectangle(80, _sceneHeight - 80, 240, 20, { isStatic: true });
            Matter.Body.rotate(a1, Math.PI / 4);
            World.addBody(_world, a1);

            World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.38, _sceneHeight - 140, 250, 20, { isStatic: true }));
            World.addBody(_world, Bodies.rectangle(_sceneWidth * 0.6, _sceneHeight * 0.5, 250, 20, { isStatic: true }));

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
            this.player.tick(this.engine);
        },

        render: function (gfx) {
            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 5%)");

            this.player.render(gfx);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
