import Controller from '../controller';
import _ from 'lodash';

class PhsController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    joinTeam(character) {

        let characters = _.where(this.game.characters, {active: true});
        if (characters.length < 3) {
            character.team();
        }

        this.game.buildTeam();

        // [saving]
        this.game.save();
    }

    leaveTeam(character) {

        let characters = _.where(this.game.characters, {active: true});
        if (characters.length > 1) {
            character.backup();
        }

        this.game.buildTeam();

        // [saving]
        this.game.save();
    }

}

PhsController.$inject = ['Game', '$location'];

export default PhsController;