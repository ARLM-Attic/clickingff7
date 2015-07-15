import _ from 'lodash';

export default class Materia {

    constructor(game, data) {

        // game reference
        this.game = game;

        // load weapon data
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
        let m = new Materia(game);

        m.id = _.uniqueId('i');

        m.data = game.store.getMateria(ref);

        m.ref = m.data.ref;

        m.lvl = 1;

        m.ap = 0;

        return m;
    }

    /**
     *
     * @param data
     */
    load(data) {
        this.data = this.game.store.getMateria(data.ref);

        this.id = data.id;

        this.ref = data.ref;

        this.lvl = data.lvl;

        this.ap = data.ap;

        this.weapon = data.weapon;
    }

    /**
     *
     * @returns {*}
     */
    save() {
        return _.pick(this, 'id', 'ref', 'lvl', 'ap');
    }

}