import Battle from './battle';
import _ from 'lodash';

export default class Story {

    constructor(game, data) {

        // game reference
        this.game = game;

        // completed once at least
        this.completed = false;

        // chain
        this.chain = 0;

        // load story data
        if (data) {
            this.load(data);
        }
    }

    static get(game, ref) {
        let s = new Story(game);

        s.data = game.store.getStory(ref);

        s.ref = s.data.ref;

        return s;
    }

    load(data) {
        this.data = this.game.store.getStory(data.ref);
        this.ref = this.data.ref;
        this.completed = (typeof data.completed === 'undefined');
        this.chain = data.chain;
    }

    complete() {
        this.completed = true;

        // search for next story
        let next = this.data.ref + 1;
        let story = _.find(this.game.stories, {ref: next});
        if (!story) {
            this.game.story(Story.get(next));
        }
    }

    save() {
        let save = _.pick(this, 'ref', 'chain');
        if (!this.completed) {
            save.completed = false;
        }
        return save;
    }

}