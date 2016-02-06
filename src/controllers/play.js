import Controller from '../controller';

class PlayController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    redirect() {
        // do nothing
    }

    init() {
        let places = [];
        for (let i of [1, 2, 3]) {
            let save = localStorage['save' + i];
            if (save) {
                places.push(JSON.parse(save));
            } else {
                places.push(null);
            }
        }

        this.places = places;
    }

    /**
     *
     * @param nSave
     */
    newGame(nSave) {
        localStorage.nSave = nSave;

        this.game.newGame(nSave);

        // [saving]
        this.game.save();

        this.$location.path('/home');
    }

    /**
     *
     * @param nSave
     */
    loadGame(nSave) {
        localStorage.nSave = nSave;

        this.game.loadGame(nSave);

        this.$location.path('/home');
    }

    /**
     *
     * @param nSave
     */
    deleteGame(nSave) {
        delete localStorage['save' + nSave];
        this.init();
    }

}

PlayController.$inject = ['Game', '$location'];

export default PlayController;