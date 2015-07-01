import Controller from '../controller';

class RewardsController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    /**
     *
     */
    init() {
        this.battle = this.game.battle;
        this.rewards = this.battle.rewards;
        this.rewards.start();
    }

    /**
     *
     */
    redirect() {
        if (!this.game.battle && !this.game.battle.rewards) {
            this.$location.path('/home');
        } else {
            this.init();
        }
    }

}

RewardsController.$inject = ['Game', '$location'];

export default RewardsController;