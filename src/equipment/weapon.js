import Equipment from '../equipment';

export default class Weapon extends Equipment {

    static get(game, ref) {
        let w = new Weapon(game);

        w.data = game.store.getWeapon(ref);

        w.ref = w.data.ref;

        return w;
    }

    load(data) {
        this.data = this.game.store.getWeapon(data.ref);

        this.ref = data.ref;
    }

}