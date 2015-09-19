import Controller from '../controller';

class LostController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    /**
     *
     */
    init() {
        this.battle = this.game.battle;
    }

    /**
     *
     */
    goHome() {
        this.$location.path('/home');
    }

    /**
     *
     */
    redirect() {
        if (!this.game.battle && !this.game.battle.lost) {
            this.$location.path('/home');
        }
    }

}

LostController.$inject = ['Game', '$location'];

export default LostController;