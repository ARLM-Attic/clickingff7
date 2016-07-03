import _ from 'lodash';
import Enemy from './units/enemy'
import 'velocity';
import 'velocity/velocity.ui.min';

// @interface
export default class Action {

    constructor(unit, data) {
        // associated unit
        this.unit = unit;

        // associated battle
        this.battle = null;

        // action reference
        this.ref = null;

        // rate
        this.rate = null;

        // image
        this.image = null;

        // using
        this.using = false;

        if (data) {
            this.load(data);
        }
    }

    /**
     *
     * @param data
     */
    load(data) {
        for (let i in data) {
            this[i] = data[i];
        }
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
     * @param type
     * @returns {*}
     */
    getTargets(type) {
        switch (type) {
            case 'enemy:1':
                return _.sample(_.filter(this.battle.enemies, (u) => {
                    return u.hp > 0;
                }));
            case 'ally:1':
                return _.sample(_.filter(this.battle.game.team, (u) => {
                    return u.hp > 0;
                }));
        }
    }

    /**
     *
     * @param type
     * @param pwr
     * @param targets
     * @returns {{}}
     */
    getDamages(type, pwr, targets) {
        switch (type) {
            case 'phy':
                return this.getPHYhits(pwr, targets);
            case 'mag':
                return this.getMAGHits(pwr, targets);
            //case 'cure':
            //return this.getCUREhits(targets);
        }
    }

    /**
     *
     * @param pwr
     * @param targets
     * @returns {{}}
     */
    getPHYhits(pwr, targets) {
        let res = {}, rng;

        // base attack
        let base = Math.floor(Math.pow(this.unit.str, 1.8) / Math.pow(targets.def, 0.5));

        // ability power
        base = 5 + base * pwr;

        // element resistance

        // defending
        if (targets.status == 'defense') {
            base *= 0.5;
        }

        // critical attack
        rng = _.random(100);
        if (rng <= 3 && !targets.defense) {
            base = Math.floor(base * 1.5);
            res.msg = 'critical';
        }

        // back row

        // defense
        if (targets.defense) {
            base = Math.floor(base * 0.5);
            res.msg = 'defense';
        }

        // element enhance

        // random variance
        rng = _.random(3);
        base = Math.floor(base * (1 + rng / 100));

        res.hits = base;

        return res;
    }

    /**
     *
     * @param pwr
     * @param targets
     * @returns {{}}
     */
    getMAGHits(pwr, targets) {
        let res = {}, rng;

        // base attack
        let base = Math.floor(Math.pow(this.unit.mgi, 1.65) / Math.pow(targets.res, 0.5));

        // ability power
        base = 5 + base * pwr;

        // element resistance

        // defending
        if (targets.defense) {
            base = Math.floor(base * 0.5);
            res.msg = 'defense';
        }

        // critical attack

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
        selector = '#' + this.unit.id + ' .avatar';
        let seq = [
            {e: $(selector), p: {translateX: 5}, o: {duration: 400}},
            {e: $(selector), p: {translateX: -1}, o: {duration: 400}}
        ];
        $.Velocity.RunSequence(seq);

        // Damage animation
        selector = '#' + unit.id + ' .damage';

        let html = '';
        if (damage.msg) {
            html += '<div class="' + damage.msg + '">' + damage.msg + '</div>';
        }
        html += '<div class="hits">' + damage.hits + '</div>';
        $(selector).html(html);

        $(selector).velocity("transition.slideUpIn", 1000, () => {
            $(selector).text("");
            unit.getDamaged(damage);
            this.battle.game.$rootScope.$apply();
            if (fn) fn();
        });
    }

    /**
     *
     */
    save() {
        let res = _.pick(this, 'ref', 'active');
        if (!res.active) {
            res.active = false;
        }
        return res;
    }

}