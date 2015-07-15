import Controller from '../controller';

class IndexController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    gameFn() {
        return this.game.mode;
    }

    isActive(route) {
        let path = this.$location.path()
        return (path == route || path.indexOf(route) > -1);
    }

    isChannel(host) {
        return this.$location.host() === host;
    }

    /**
     * Go to the game
     */
    goGame() {
        this.$location.path("/home");
    }

    /**
     * Go to the story
     */
    goStory() {
        this.$location.path("/story");
    }

    /**
     * Go to the equipment section
     */
    goEquip() {
        this.$location.path("/equip");
    }

    /**
     * Go to the PHS
     */
    goPHS() {
        this.$location.path("/phs");
    }

}

IndexController.$inject = ['Game', '$location'];

export default IndexController;