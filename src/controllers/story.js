import Controller from '../controller';

class StoryController extends Controller {

    constructor(game, $location) {
        super(game, $location);
    }

    init() {
        this.story = this.game.story;

        if (!this.story.played) {

            // play story scenes
            this.$location.path('/talk');
        }
    }

    /**
     *
     * @param story
     */
    toggle(story) {
        this.story = (this.story == null) ? story: null;
    }

    /**
     * Returns true if the story is currently selected
     */
    isCurrent() {
        return (this.story && this.story.ref == this.game.story.ref);
    }

    /**
     *
     */
    select() {
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