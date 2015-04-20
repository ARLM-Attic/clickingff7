import Weapon from './weapon';

export default class Character {

    constructor(game, data, inTeam = false) {

        // game reference
        this.game = game;

        // character is active (in team)
        this.inTeam = inTeam;

        // load character data
        this.load(data);

        // level
        this.lvl = 1;

    }

    load(data) {
        this.data = data;

        // initial weapon
        let weaponData = this.game.getWeaponFromData(data.weaponType, data.weaponName);
        this.weapon = new Weapon(this.game, weaponData);

        // refresh hp & mp
        this.hp = this.hpMax;
        this.mp = this.mpMax;
    }

    get hpMax() {
        return Math.floor(this.data.hp / 100 * this.lvl);
    }

    get mpMax() {
        return Math.floor(this.data.mp / 100 * this.lvl);
    }

}