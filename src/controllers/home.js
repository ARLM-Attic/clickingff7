import Controller from '../controller';
import Battle from '../battle';

class HomeController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    fight() {
        this.game.battle = new Battle(this.game);

        // [saving]
        this.game.save();

        this.$location.path('/battle');
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