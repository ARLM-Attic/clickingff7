import Battle from './battle';

export default class Story {

    constructor(game, data) {

        // game reference
        this.game = game;

        // completed once at least
        this.completed = false;

        // load story data
        if (data) {
            this.load(data);
        }
    }

    static get(game, storyNo) {
        let s = new Story(game);

        s.data = game.store.getStory(storyNo);

        return s;
    }

    load(data) {
        this.data = this.game.store.getStory(data.number);
        this.completed = data.completed;
    }

    complete() {
        this.completed = true;

        // todo search for next story
        /*let next = this.data.nbr + 1;
        let added = this.game.addStory(next);
        if (!added) {
            // todo display popup
        }*/
    }

    save() {
        return _.pick(this, 'completed');
    }

}