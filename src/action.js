import _ from 'lodash';

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
        let selector;

        // Attacker animation
        /*selector = '#' + this.character.id + ' .avatar';
        let seq = [
            {e: $(selector), p: {translateX: 5}, o: {duration: 400}},
            {e: $(selector), p: {translateX: -1}, o: {duration: 400}}
        ];
        $.Velocity.RunSequence(seq);*/

        // Damage animation
        selector = '#' + unit.id + ' .damage';

        let html = '';
        if (damage.critical) {
            html += '<div class="critical">Critique</div>';
        }
        html +='<div class="hits">' + damage.hits + '</div>';
        //$(selector).html(html);

        /*$(selector).velocity("transition.slideUpIn", 1000, () => {*/
            //$(selector).text("");
            unit.getDamaged(damage);
            this.battle.game.$rootScope.$apply();
            if (fn) fn();
        /*});*/
    }

}