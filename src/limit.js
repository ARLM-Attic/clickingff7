import _ from 'lodash';

export default class Limit {
    
    constructor(game, data) {
        // game reference
        this.game = game;

        // load limit data
        if (data) {
            this.load(data);
        }
    }

    static get(game, ref) {
        let l = new Limit(game);

        l.data = game.store.getLimit(ref);

        l.id = _.uniqueId('i');

        l.ref = l.data.ref;

        return l;
    }

    load(data) {
        this.data = this.game.store.getLimit(data.ref);

        this.id = data.id;

        this.ref = data.ref;

    }
    
    save() {
        return _.pick(this, 'id', 'ref');
    }

}