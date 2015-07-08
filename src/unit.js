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