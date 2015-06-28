export default class Weapon {

    constructor(game, data) {

        // game reference
        this.game = game;

        // load weapon data
        if (data) {
            this.load(data);
        }
    }

    static get(game, ref) {
        let w = new Weapon(game);

        w.data = game.store.getWeapon(ref);

        return w;
    }

    load(data) {
        this.data = this.game.store.getWeapon(data.ref);
    }

    save() {
        let save = {};

        save.ref = this.data.ref;

        return save;
    }

}