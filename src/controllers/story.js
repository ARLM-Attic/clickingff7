import Controller from '../controller';

class StoryController extends Controller {

    constructor(game, $location) {
        super(game, $location);

        this.seeStory(this.game.story);
    }

    seeStory(story) {
        this.story = story;
    }

    selectStory() {
        // select story
        this.game.story = this.story;

        // [saving]
        this.game.save();

        // go to game section
        this.$location.path('/home');
    }

}

StoryController.$inject = ['Game', '$location'];

export default StoryController;