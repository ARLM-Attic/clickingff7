import Battle from './battle';
import Talk from './talk';
import _ from 'lodash';

export default class Story {

    constructor(game, data) {

        // game reference
        this.game = game;

        // scene already played?
        this.played = false;

        // completed once at least
        this.completed = false;

        // chain
        this.chain = 0;

        // load story data
        if (data) {
            this.load(data);
        }
    }

    /**
     *
     * @param game
     * @param ref
     */
    static get(game, ref) {
        let s = new Story(game);

        s.data = game.store.getStory(ref);

        s.scene = game.store.getScene(ref).content;

        s.ref = s.data.ref;

        return s;
    }

    /**
     *
     * @param data
     */
    load(data) {
        this.data = this.game.store.getStory(data.ref);
        this.scene = this.game.store.getScene(data.ref).content;
        this.ref = this.data.ref;
        this.completed = (typeof data.completed === 'undefined');
        this.played = (typeof data.played === 'undefined');
        this.chain = data.chain;
    }

    /**
     * Play story scenes
     */
    play() {
        this.talk = new Talk(this);


    }

    /**
     *
     */
    isBossAvalaible() {
        return (this.chain >= this.data.nbBattles && !this.completed);
    }

    /**
     *
     */
    complete() {
        this.completed = true;

        // search for next story
        this.game.addStory(this.data.ref + 1, true);
    }

    /**
     *
     * @returns {boolean}
     */
    isNext() {
        let next = this.data.ref + 1;
        let story = _.find(this.game.stories, {ref: next});
        return (this.completed &&!_.isNull(story));
    }

    /**
     *
     * @returns {*}
     */
    save() {
        let save = _.pick(this, 'ref', 'chain');
        if (!this.completed) {
            save.completed = false;
        }
        if (!this.played) {
            save.played = false;
        }
        return save;
    }

}