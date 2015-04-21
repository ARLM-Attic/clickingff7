export default class Weapon {

    constructor(game, data) {

        // game reference
        this.game = game;

        // load weapon data
        if (data) {
            this.load(data);
        }
    }

    static get(game, type, name) {
        let w = new Weapon(game);

        w.data = game.getWeaponFromData(type, name);

        return w;
    }

    load(data) {
        this.data = this.game.getWeaponFromData(data.type, data.name);
    }

    save() {
        let save = {};

        save.name = this.data.name;

        return save;
    }

}