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
        if (this.game.battle) {
            this.init();
        } else {
            this.$location.path('/home');
        }
    }

    /**
     *
     * @param character
     * @param status
     */
    toggle(character, status) {
        character.status = status;
    }

}

BattleController.$inject = ['Game', '$location'];

export default BattleController;