export default class Controller {

    constructor(game, $location) {
        this.game = game;
        this.$location = $location;
        
        // if current ingame
        if (localStorage.nSave) {
            this.loadGame(localStorage.nSave);
        }

        this.redirect();
    }

    /**
     * Redirect if not loaded
     * @override
     */
    redirect() {
        if (this.init) {
            this.init();
        }
    }

}