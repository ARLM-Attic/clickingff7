import Controller from '../controller';

class StoryController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    selectStory(story) {
        this.current = story;
    }

    selectPart(partNo) {
        // do the battle :-)
        let storyNo = this.current.data.nbr;
        this.game.newBattle(storyNo, partNo, 1);

        // go to battle section
        this.$location.path('/battle');
    }

}

StoryController.$inject = ['Game', '$location'];

export default StoryController;