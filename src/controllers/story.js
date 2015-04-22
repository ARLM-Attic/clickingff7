import Controller from '../controller';

class StoryController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    selectStory(story) {
        this.current = story;
    }

    selectPart(part) {
        // todo handle battle
    }

}

StoryController.$inject = ['Game', '$location'];

export default StoryController;