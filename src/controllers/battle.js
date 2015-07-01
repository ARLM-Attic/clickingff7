import Controller from '../controller';

class BattleController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    /**
     *
     */
    init() {
        this.battle = this.game.battle;
        this.battle.start();
    }

    /**
     *
     */
    redirect() {
        if (!this.game.battle) {
            this.$location.path('/home');
        } else {
            this.init();
        }
    }

    /**
     *
     */
    quitBattle() {
        this.game.battle.quit();

        // [saving]
        this.game.save();

        this.$location.path('/home');
    }

}

BattleController.$inject = ['Game', '$location'];

export default BattleController;