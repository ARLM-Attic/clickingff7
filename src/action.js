import $ from 'jquery';
import 'velocity';
import 'velocity.ui';

// @interface
export default class Action {

    constructor(character) {
        this.character = character;

        // this action can be disabled
        this.active = true;

        // associated battle
        this.battle = null;

        // power of the action
        this.pwr = 1;
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
     * @returns {boolean}
     */
    isAvailable() {
        return true;
    }

    /**
     *
     * @param fn
     */
    execute(fn) {
        if (fn) fn();
    }

    /**
     *
     * @param attacker
     * @param defender
     * @returns {{}}
     */
    getHits(attacker, defender) {
        let res = {}, rng;

        // base attack
        let base = Math.floor(Math.pow(attacker.str, 1.8) / Math.pow(defender.def, 0.5));

        // ability power
        base = 5 + base * this.pwr;

        // element resistance

        // defending

        // critical attack
        rng = _.random(100);
        if (rng <= 3) {
            base = Math.floor(base * 1.5);
            res.critical = true;
        }

        // back row

        // element enhance

        // random variance
        rng = _.random(3);
        base = Math.floor(base * (1 + rng / 100));

        res.hits = base;

        return res;
    }

    /**
     *
     * @param unit
     * @param damage
     * @param fn
     */
    animAttack(unit, damage, fn) {
        let selector = '#' + unit.id + ' .damage';
        $(selector).text(damage.hits);
        $(selector).velocity("transition.slideUpIn", 1000, () => {
            $(selector).text("");
            unit.getDamaged(damage);
            this.battle.game.$rootScope.$apply();
            if (fn) fn();
        });
    }

}