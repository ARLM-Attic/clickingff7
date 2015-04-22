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

    static get(game, nbr) {
        let s = new Story(game);

        s.data = game.store.getStory(nbr);

        return s;
    }

    load(data) {
        this.data = this.game.store.getStory(data.nbr);

        this.completed = data.completed;
    }

    complete() {
        this.completed = true;

        // search for next story ?
        let next = this.data.nbr++;
        let added = this.game.addStory(next);
        if (!added) {
            // todo display popup
        }
    }

    save() {
        var save = _.pick(this, 'completed');

        save.nbr = this.data.nbr;

        return save;
    }

}