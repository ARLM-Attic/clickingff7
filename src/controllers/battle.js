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
     */
    togglePause() {
        this.game.battle.togglePause();
    }

    /**
     *
     * @param character
     */
    toggleStatus(character) {
        let status = character.status;
        if (status == 'attack') {
            character.status = 'defense';
        } else if (status == 'defense') {
            character.status = 'attack';
        }
    }

    /**
     *
     * @param action
     */
    doAction(action) {
        if (action.isAvailable()) {
            this.battle.addPlayerAction(action);
        }
    }

    /**
     * 
     */
    fightBoss() {
        
        if (!this.battle.canFightBoss) {
            return;
        }
        
        this.battle.setPause(true);
        
        this.battle.chooseBoss();
        
        // [saving]
        this.game.save();
        
        this.battle.start();
        
    }
    
    /**
     * 
     */
    quit() {
        this.battle.setPause(true);
        this.game.battle = null;

        // chain break
        this.game.story.chain = 0;

        // team recover
        for (let i of this.game.team) {
            i.recover();
        }

        // [saving]
        this.game.save();

        this.$location.path('/home');
    }

}

BattleController.$inject = ['Game', '$location'];

export default BattleController;