import Equipment from '../equipment';
import _ from 'lodash';

export default class Armor extends Equipment {

    static get(game, ref) {
        let w = new Armor(game);

        w.data = game.store.getArmor(ref);

        w.id = _.uniqueId('i');

        w.ref = w.data.ref;

        w.materias = {};

        return w;
    }

    load(data) {
        this.data = this.game.store.getArmor(data.ref);

        this.id = data.id;

        this.ref = data.ref;

        this.materias = {};
    }

    /**
     *
     * @returns {string}
     */
    getType() {
        return 'armor';
    }

}