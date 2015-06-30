import Controller from '../controller';

class HomeController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

}

HomeController.$inject = ['Game', '$location'];

export default HomeController;