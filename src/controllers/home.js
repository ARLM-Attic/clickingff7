import Controller from '../controller';
import Battle from '../battle';

class HomeController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    fight() {
        this.game.battle = new Battle(this.game);
        this.game.battle.chooseEnemies();

        // [saving]
        this.game.save();

        this.$location.path('/battle');
    }

    fightBoss() {
        this.game.battle = new Battle(this.game);
        this.game.battle.chooseBoss();
        
        // [saving]
        this.game.save();
        
        this.$location.path('/battle');
    }

    nextStory() {
        this.game.addStory(this.game.story.ref + 1, true);

        // [saving]
        this.game.save();
    }

    recover() {

        for (let i of this.game.team) {
            i.recover();
        }

        this.game.story.chain= 0;

        // [saving]
        this.game.save();

    }

}

HomeController.$inject = ['Game', '$location'];

export default HomeController;