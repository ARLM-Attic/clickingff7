import Equipment from '../equipment';
import _ from 'lodash';

export default class Weapon extends Equipment {

    static get(game, ref) {
        let w = new Weapon(game);

        w.data = game.store.getWeapon(ref);

        w.id = _.uniqueId('i');

        w.ref = w.data.ref;

        w.materias = [];

        return w;
    }

    load(data) {
        this.data = this.game.store.getWeapon(data.ref);

        this.id = data.id;

        this.ref = data.ref;

        if (data.materias) {

            this.materias = [];

            for (let id of data.materias) {
                this.materias.push(
                    _.find(this.game.materias, {id: id})
                );
            }

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