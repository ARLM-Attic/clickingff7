import _ from 'lodash';

export default class Limit {
    
    constructor(game, data) {
        // game reference
        this.game = game;
        
        // unlocked
        this.unlocked = false;

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
        
        l.unlocked = l.data.unlocked;

        return l;
    }

    load(data) {
        this.data = this.game.store.getLimit(data.ref);

        this.id = data.id;

        this.ref = data.ref;
        
        this.unlocked = data.unlocked;

    }
    
    save() {
        return _.pick(this, 'id', 'unlocked');
    }

}