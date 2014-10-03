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

        init: function (x, y) {
            this._super(x, y);
        },

        tick: function (engine) {

            /*this.x += Math.sin(Date.now() / 1000);

            if (Ω.input.released("left") || Ω.input.released("right")) {
                this.rthrust = 0;
            }
            if (Ω.input.released("up") || Ω.input.released("down")) {
                this.thrust = 0;
            }*/

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

            return true;

        },

        
        render: function (gfx) {

            var c = gfx.ctx;

            this.ship.render(gfx, this.x, this.y);

        }

    });

    window.Player = Player;

}(window.Ω));
