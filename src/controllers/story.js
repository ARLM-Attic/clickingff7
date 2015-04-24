import Controller from '../controller';

class StoryController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    selectStory(story) {
        this.current = story;
    }

    selectPart(partNo) {
        // todo improve this test
        if (this.current.partNo < partNo) {
            return;
        }

        // do the battle :-)
        let data = {
            storyNo : this.current.data.storyNo,
            partNo  : partNo,
            battleNo: 1
        };
        this.game.newBattle(data);

        // go to battle section
        this.$location.path('/battle');
    }

}

StoryController.$inject = ['Game', '$location'];

export default StoryController;