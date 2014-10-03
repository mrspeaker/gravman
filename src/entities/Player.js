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

        tick: function () {

            this.x += Math.sin(Date.now() / 1000);

            if (Ω.input.released("left") || Ω.input.released("right")) {
                this.rthrust = 0;
            }
            if (Ω.input.released("up") || Ω.input.released("down")) {
                this.thrust = 0;
            }

            return true;

        },

        
        render: function (gfx) {

            var c = gfx.ctx;

            this.ship.render(gfx, this.x, this.y);

        }

    });

    window.Player = Player;

}(window.Ω));
