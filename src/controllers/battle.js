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

}

BattleController.$inject = ['Game', '$location'];

export default BattleController;