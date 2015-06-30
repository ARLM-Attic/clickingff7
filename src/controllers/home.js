import Controller from '../controller';
import Battle from '../battle';

class HomeController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    battle() {
        this.game.battle = new Battle(this.game);

        // [saving]
        this.game.save();

        this.$location.path('/battle');
    }

}

HomeController.$inject = ['Game', '$location'];

export default HomeController;