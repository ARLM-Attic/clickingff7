import Controller from '../controller';

class PhsController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    joinTeam(character) {
        if (this.game.team.length < 3) {
            this.game.joinTeam(character);
        }

        // [saving]
        this.game.save();
    }

    leaveTeam(character) {
        if (this.game.team.length > 1) {
            this.game.leaveTeam(character);
        }

        // [saving]
        this.game.save();
    }

}

PhsController.$inject = ['Game', '$location'];

export default PhsController;