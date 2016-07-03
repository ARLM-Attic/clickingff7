import _ from 'lodash';

export default class Relic {

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
     * @returns {*}
     */
    static get(game, ref) {
        let w = new Relic(game);

        w.data = game.store.getRelic(ref);

        w.id = _.uniqueId('i');

        w.ref = w.data.ref;

        w.materias = [];

        return w;
    }

    /**
     *
     * @param data
     */
    load(data) {
        this.data = this.game.store.getRelic(data.ref);

        this.id = data.id;

        this.ref = data.ref;

        this.materias = [];
    }

    /**
     *
     * @param ids
     * todo
     */
    loadMaterias(ids) {

        // no materia?
        if (_.isEmpty(ids)) {
            return;
        }

        // load materia
        for (let i in ids) {
            let materia = _.find(this.game.materias, {id: ids[i]});
            if (i < this.data.holes) {
                this.equip(materia);
            }
        }
    }

    /**
     *
     * @returns {Array}
     */
    removeAllMateria() {

        const res = this.materias;

        this.materias = [];

        return res;
    }

    /**
     *
     * @param materia
     */
    equip(materia) {
        this.materias.push(materia);
    }

    /**
     *
     * @param materia
     */
    unequip(materia) {
        _.pull(this.materias, materia);
    }

    /**
     *
     * @returns {{}}
     */
    save() {
        return _.pick(this, 'id', 'ref');
    }

}