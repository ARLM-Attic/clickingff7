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
     * Get Tick Speed
     * @returns {number}
     */
    getTS() {
        let x = 0;
        let fx = 0;
        while (fx < this.dex) {
            x++;
            fx += 2 * (x + 1);
        }
        return (28 - x / 2);
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
     *
     * @param stat
     * @returns {number}
     */
    progress(stat) {
        return Math.floor(this[stat] * 100 / this[stat + 'Max']);
    }

}