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
        this.game.story = this.story;
        this.game.battle = new Battle(this.game);

        // go to game section
        this.$location.path('/game');
    }

}

StoryController.$inject = ['Game', '$location'];

export default StoryController;