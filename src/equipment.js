import _ from 'lodash';

export default class Equipment {

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
     * @param ids
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
                this.equip(i, materia);
            }
        }
    }

    /**
     *
     * @returns {{}}
     */
    removeAllMateria() {

        // get materia ids
        let res = this.getMateriaIds();

        // remove all materia
        this.materias = _.fill(new Array(this.data.holes), null);

        return res;
    }

    /**
     *
     * @returns {{}}
     */
    getMateriaIds() {
        let res = {};

        for (let i in this.materias) {
            let materia = this.materias[i];
            if (materia) {
                res[i] = materia.id;
            }
        }

        return res;
    }

    /**
     *
     * @returns {Array}
     * @deprecated
     */
    nbHoles() {
        return _.range(this.data.holes);
    }

    /**
     *
     * @param hole
     * @param materia
     */
    equip(hole, materia) {
        this.materias[hole] = materia;
    }

    /**
     *
     * @param hole
     */
    unequip(hole) {
        delete this.materias[hole];
    }

    /**
     *
     * @returns {{}}
     */
    save() {
        return _.pick(this, 'id', 'ref');
    }

}