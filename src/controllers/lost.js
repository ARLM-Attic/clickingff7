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

        // team recover hp&mp
        for (let i of this.game.team) {
            i.recover();
        }

        this.game.battle = null;

        // [saving]
        this.game.save();

        this.$location.path('/home');
    }

    /**
     *
     */
    redirect() {
        if (this.game.battle && this.game.battle.lost) {
            this.init();
        } else {
            this.$location.path('/home');
        }
    }

}

LostController.$inject = ['Game', '$location'];

export default LostController;