import Controller from '../controller';

class BattleController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    redirect() {
        if (!this.game.battle) {
            this.$location.path('/game');
        }
    }

    selectTarget(target) {
        this.game.battle.target = [target];
    }

    doAttack() {
        this.game.battle.execute('attack');
    }

}

BattleController.$inject = ['Game', '$location'];

export default BattleController;