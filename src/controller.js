export default class Controller {

    constructor(game, $location) {
        this.game = game;
        this.$location = $location;

        this.redirect();
    }

    /**
     * Redirect if not loaded
     * @override
     */
    redirect() {
        /*if (!this.game.loaded) {
         this.$location.path('/game');
         }*/
    }

}