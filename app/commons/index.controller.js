import Controller from 'commons/controller';

class IndexController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    redirect() {
        // do nothing
    }

    /**
     * Active route?
     */
    isActive(route) {
        let path = this.$location.path();
        return (path == route || path.indexOf(route) > -1);
    }

    /**
     * Go to the game
     */
    goGame() {
        this.$location.path("/home");
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
    
    /**
     * Quit the current game
     */
    quit() {
        
        // [saving]
        this.game.save();
        
        // quit
        this.game.quit();
        
        // redirect
        this.$location.path('/play');
    }

}

IndexController.$inject = ['Game', '$location'];

export default IndexController;