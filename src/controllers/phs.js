import Controller from '../controller';

class PHSController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    joinTeam(character) {
        if (this.game.team.length < 3) {
            this.game.joinTeam(character);
        }
        this.game.save();
    }

    leaveTeam(character) {
        if (this.game.team.length > 1) {
            this.game.leaveTeam(character);
        }
        this.game.save();
    }

}

PHSController.$inject = ['Game', '$location'];

export default PHSController;