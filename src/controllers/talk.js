import Controller from '../controller';

class TalkController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    init() {
        this.story = this.game.story;
        this.story.play();
    }

}

TalkController.$inject = ['Game', '$location'];

export default TalkController;