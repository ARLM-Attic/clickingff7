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
     * @param ids {Array}
     */
    loadMaterias(ids) {

        // check nbHoles
        ids = _.zipObject(_.take(_.pairs(ids), this.data.holes));

        // load materia
        for (let i in ids) {
            let materia = _.find(this.game.materias, {id: ids[i]});
            this.equip(i, materia);
        }
    }

    /**
     *
     * @returns {Array}
     */
    removeAllMateria() {

        // get materia ids
        let res = [];
        for (let i in this.materias) {
            res.push(this.materias[i].id);
        }

        // remove all materia
        this.materias = {};

        return res;
    }

    /**
     *
     * @returns {Array}
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