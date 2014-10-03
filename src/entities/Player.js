(function (Ω) {

    "use strict";

    var Player = Ω.Entity.extend({
        w: 32,
        h: 24,

        vr: 0,
        thrust: 0,
        friction: data.physics.friction,

        vx: 0,
        vy: 0,
        vtotal: 0,

        rotation: 0,
        rthrust: 0,
        rfriction: data.physics.rot_friction,

        rvtotal: 0,

        ship: new Ω.Image("res/images/taxi.png"),

        init: function (x, y, screen) {
            this._super(x, y);
            this.screen = screen;
        },

        tick: function (engine) {

            var xf = this.p.force.x,
                yf = this.p.force.y,
                px = -engine.world.gravity.y,
                py = engine.world.gravity.x;

            if (Ω.input.pressed("up")) {
                xf -= (engine.world.gravity.x) * 0.05;
                yf -= (engine.world.gravity.y) * 0.05;
            }

            if (Ω.input.isDown("left")) {
                if(this.p.speed < 5) {
                    xf += px * 0.005;
                    yf += py * 0.005;
                }
            }
            if (Ω.input.isDown("right")) {
                if(this.p.speed < 5) {
                    xf += -px * 0.005;
                    yf += -py * 0.005;
                }
            }

            this.p.force.x = xf;
            this.p.force.y = yf;

            this.x = this.p.position.x;
            this.y = this.p.position.y;

            return true;

        },

        
        render: function (gfx) {

            var c = gfx.ctx,
                s = this.screen;

            c.save();
            c.translate(this.x, this.y);
            c.rotate(this.screen.gravity - (Math.PI / 2));
            this.ship.render(gfx, -22, -26);
            c.translate(-this.x, -this.y);
            c.restore();


        }

    });

    window.Player = Player;

}(window.Ω));
