import Equipment from '../equipment';
import _ from 'lodash';

export default class Weapon extends Equipment {

    static get(game, ref) {
        let w = new Weapon(game);

        w.data = game.store.getWeapon(ref);

        w.id = _.uniqueId('i');

        w.ref = w.data.ref;

        w.materias = _.fill(new Array(w.data.holes), null);

        return w;
    }

    load(data) {
        this.data = this.game.store.getWeapon(data.ref);

        this.id = data.id;

        this.ref = data.ref;

        this.materias = _.fill(new Array(this.data.holes), null);

        if (data.materias) {

            // data.materias is an object
            /*for (let i in data.materias) {
                this.materias[i] = _.find(
                    this.game.materias,
                    {id: data.materias[i]}
                );
            }*/

        }

    }

    /**
     *
     * @returns {string}
     */
    getType() {
        return 'weapon';
    }

}