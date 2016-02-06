import Equipment from '../equipment';
import _ from 'lodash';

export default class Accessory extends Equipment {

    static get(game, ref) {
        let w = new Accessory(game);

        w.data = game.store.getAccessory(ref);

        w.id = _.uniqueId('i');

        w.ref = w.data.ref;

        w.materias = {};

        return w;
    }

    load(data) {
        this.data = this.game.store.getAccessory(data.ref);

        this.id = data.id;

        this.ref = data.ref;

        this.materias = {};
    }

    /**
     *
     * @returns {string}
     */
    getType() {
        return 'accessory';
    }

}