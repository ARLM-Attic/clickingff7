import Weapon from './weapon';

export default class Character {

    constructor(game, data) {

        // game reference
        this.game = game;

        // load character data
        if (data) {
            this.load(data);
        }
    }

    static get(game, name) {
        let c = new Character(game);

        c.data = game.store.getCharacter(name);

        // initial weapon
        c.weapon = Weapon.get(game, c.data.weapon.type, c.data.weapon.name);

        // level
        c.lvl = 1;

        // fill hp & mp
        c.recover();

        return c;
    }

    load(data) {
        this.data = this.game.store.getCharacter(data.name);

        // weapon
        this.weapon = new Weapon(this.game, this.data.weapon);

        // level
        this.lvl = data.lvl;

        // fill hp & mp
        this.recover();
    }

    /**
     * Recover HP & MP
     */
    recover() {
        this.hp = this.hpMax;
        this.mp = this.mpMax;
    }

    get hpMax() {
        return Math.floor(this.data.hp / 100 * this.lvl);
    }

    get mpMax() {
        return Math.floor(this.data.mp / 100 * this.lvl);
    }

    save() {
        var save = _.pick(this, 'lvl');

        save.name = this.data.name;
        save.weapon = this.weapon.save();

        return save;
    }

}