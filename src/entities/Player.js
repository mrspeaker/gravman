(function (Ω) {

    "use strict";

    var Player = Ω.Entity.extend({
        w: 32,
        h: 24,

        tgravity: 0,

        ship: new Ω.Image("res/images/taxi.png"),

        pixels: null,

        init: function (x, y, screen) {
            this._super(x, y);
            this.screen = screen;

            this.pixels = [];
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    this.pixels.push({ x: j * 10, y: i * 12, w: 10, h: 12, xo: 0, yo: 0 });
                }
            }
        },

        tick: function (engine) {

            var p = this.p,
                xf = p.force.x,
                yf = p.force.y,
                // 90 degrees to gravity
                px = -engine.world.gravity.y,
                py = engine.world.gravity.x,
                leftRightPow = 0.005,
                jumpPow = 0.05,
                speedMax = 7;

            if (Ω.input.pressed("up")) {
                xf -= (engine.world.gravity.x) * jumpPow;
                yf -= (engine.world.gravity.y) * jumpPow;
            }

            if (Ω.input.isDown("left")) {
                if(p.speed < speedMax) {
                    xf += px * leftRightPow;
                    yf += py * leftRightPow;
                }
            }
            if (Ω.input.isDown("right")) {
                if(p.speed < speedMax) {
                    xf += -px * leftRightPow;
                    yf += -py * leftRightPow;
                }
            }

            p.force.x = xf;
            p.force.y = yf;

            this.x = p.position.x;
            this.y = p.position.y;

            if (this.screen.gravity < this.tgravity) {
                this.tgravity -= 0.15;
            }
            if (this.screen.gravity > this.tgravity) {
                this.tgravity += 0.15;
            }

            this.pixels = this.pixels.map(function (px) {
                px.yo += Math.sin((Date.now() / 100) + (px.x + px.y)) * (p.speed / 4);
                if (px.yo > 0) px.yo -= 0.5;
                if (px.yo < 0) px.yo += 0.5;
                return px;
            });

            return true;

        },

        render: function (gfx) {

            var c = gfx.ctx,
                x = this.x,
                y = this.y,
                xo = -22,
                yo = -26;

            c.save();
            c.translate(x, y);
            c.rotate(this.tgravity - (Math.PI / 2));
            //this.ship.render(gfx, xo, yo);

            var img = this.ship.img;

            c.fillStyle = "rgba(0, 0, 0, 0.5)";
            this.pixels.forEach(function (p) {
                //c.fillRect(p.x + xo, p.y + yo + 5, p.w, p.h);
                c.drawImage(
                    img,
                    p.x,
                    p.y,
                    p.w,
                    p.h,
                    p.x + xo,
                    p.y + yo + p.yo,
                    p.w,
                    p.h);
            });

            c.translate(-x, -y);
            c.restore();

        }

    });

    window.Player = Player;

}(window.Ω));
