import Controller from '../controller';

class StatusController extends Controller {

    constructor(game, $location, $routeParams) {
        this.$routeParams = $routeParams;
        super(game, $location);
    }

    /**
     *
     */
    init() {
        this.ref = this.$routeParams.character;
        let characters = _.union(this.game.team, this.game.backup);
        for (let i of characters) {
            if (i.ref == this.ref) {
                this.character = i;
                this.game.selectedCharacter = i;
                break;
            }
        }
    }

    /**
     *
     * @param character
     */
    selectCharacter(character) {
        this.$location.path('/status/' + character.ref);
    }

}

StatusController.$inject = ['Game', '$location', '$routeParams'];

export default StatusController;