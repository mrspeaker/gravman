(function (Ω) {

    "use strict";

    var GravMan = Ω.Game.extend({

        canvas: "#board",
        fps: true,

        init: function (w, h) {

            this._super(w, h);

            Ω.evt.progress.push(function (remaining, max) {
                //console.log((((max - remaining) / max) * 100 | 0) + "%");
            });

            Ω.input.bind({
                "space": "space",
                "touch": "touch",
                "escape": "escape",
                "left": ["a", "left"],
                "right": ["d", "right"],
                "up": ["w", "up"],
                "down": ["s", "down"],
                "moused": "mouse1"
            });

            this.running = false;


        },

        stopPreload: function () {
            // Clear the preloader thing
            if (preloo) {
                clearInterval(preloo);
                document.querySelector("#board").style.background = "#000";
            }

        },

        reset: function () {

            this.setScreen(new MainScreen());

        },

        load: function () {

            this.stopPreload();

            this.reset();

        }

    });

    window.GravMan = GravMan;

}(Ω));
