import Controller from '../controller';
import Battle from '../battle';

class StoryController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    selectStory(story) {
        this.story = story;
    }

    goSelectedStory() {
        // new battle
        this.game.battle = new Battle(this.game, this.story);

        // [saving]

        // go to game section
        this.$location.path('/battle');
    }

}

StoryController.$inject = ['Game', '$location'];

export default StoryController;