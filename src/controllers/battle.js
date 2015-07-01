import Controller from '../controller';

class BattleController extends Controller {

    constructor(game, $location) {
        super(game, $location);

        if (this.game.battle) {
            this.game.battle.start();
        }
    }

    redirect() {
        if (!this.game.battle) {
            this.$location.path('/home');
        }
    }

    quitBattle() {
        this.game.battle.quit();

        // [saving]
        this.game.save();

        this.$location.path('/home');
    }

}

BattleController.$inject = ['Game', '$location'];

export default BattleController;