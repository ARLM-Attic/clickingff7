import Battle from './battle';

export default class Story {

    constructor(game, data) {

        // game reference
        this.game = game;

        // completed once at least
        this.completed = false;

        // max part to do
        this.partNo = 1;

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
        this.data = this.game.store.getStory(data.storyNo);

        this.completed = data.completed;

        this.partNo = data.partNo;
    }

    getPart() {
        return this.data.parts[this.partNo - 1];
    }

    nextPart(part) {
        if (part == this.partNo) {
            this.partNo++;
            if (this.partNo > this.data.parts.length) {
                this.complete();
            }
        }

    }

    complete() {
        this.partNo = 1;
        this.completed = true;

        // todo search for next story
        /*let next = this.data.nbr + 1;
        let added = this.game.addStory(next);
        if (!added) {
            // todo display popup
        }*/
    }

    save() {
        var save = _.pick(this, 'completed', 'partNo');

        save.storyNo = this.data.storyNo;

        return save;
    }

}