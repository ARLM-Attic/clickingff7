export default class Unit {

    constructor(game, data) {
        // game reference
        this.game = game;

        // battle initiative
        this.sum = 0;

        // load unit data
        if (data) {
            this.load(data);
        }
    }

    /**
     * Recover HP & MP
     */
    recover() {
        this.hp = this.hpMax;
        this.mp = this.mpMax;
        this.atb = 0;
    }

    get hpMax() {
        return this.data.hp * this.lvl;
    }

    get mpMax() {
        return this.data.mp * this.lvl;
    }

    get str() {
        return this.data.str * this.lvl;
    }

    get def() {
        return this.data.def * this.lvl;
    }

    get dex() {
        return this.data.dex * this.lvl;
    }

    /**
     *
     * @param battle
     */
    setBattle(battle) {
        this.battle = battle;
    }

    /**
     *
     * @param damage
     */
    getDamaged(damage) {
        this.hp -= damage.hits;
        if (this.hp <= 0) {
            this.hp = 0;
        }
    }

    /**
     *
     * @param battle
     * @param fn
     */
    ai(battle, fn) {
        if (fn) fn();
    }

    /**
     * Used by progress bars
     * @param stat
     * @param maxPixels
     * @returns {number}
     */
    progress(stat, maxPixels) {
        return Math.floor(this[stat] * maxPixels / this[stat + 'Max']);
    }

}