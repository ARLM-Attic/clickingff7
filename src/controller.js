export default class Controller {

    constructor(game, $location) {
        this.game = game;
        this.$location = $location;

        // redirect rules
        this.redirect();

        // init controller
        this.init();
    }

    /**
     * Redirect if not loaded
     * @override
     */
    redirect() {

        // if current ingame
        if (!this.game.loaded) {
            if (localStorage.nSave) {
                this.game.loadGame(localStorage.nSave);
            } else if (this.$location.path() != '/play') {
                this.$location.path('/play');
            }
        }

    }

    /**
     *
     */
    init() {

    }

}