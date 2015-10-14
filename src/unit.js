import ActionAttack from './actions/attack';

export default class Unit {

    constructor(game, data) {
        // game reference
        this.game = game;

        // battle initiative
        this.cts = 0;

        // load unit data
        if (data) {
            this.load(data);
        }
    }

    /**
     *
     * @returns {number}
     */
    get ctsMax() {
        return 4500 - this.dex / 150;
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
            this.getRewards();
        }
    }
    
    /**
     * 
     */
    getRewards() {
        
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