import _ from 'lodash';
import Unit from './unit';
import ActionEnemy from './actions/enemy'

export default class Enemy extends Unit {

    /**
     *
     * @param battle
     * @param ref
     */
    static get(battle, ref) {
        let c = new Enemy(battle.game);

        c.data = battle.game.store.getEnemy(ref);

        // level
        c.lvl = battle.story.data.level;

        // stats according the level
        c.calcStats();

        // css reference
        c.id = _.uniqueId(ref);

        c.ref = ref;

        // fill hp & mp
        c.recover();

        return c;
    }

    /**
     *
     * @param data
     */
    load(data) {
        this.data = this.game.store.getEnemy(data.ref);

        // level
        this.lvl = battle.story.data.level;

        // stats according the level
        this.calcStats();

        // css reference
        this.id = _.uniqueId(data.ref);

        this.ref = data.ref;

        // fill hp & mp
        this.recover();
    }

    /**
     *
     */
    calcStats() {
        this.hpMax = this._calcStat('hp', 1, 700);
        this.mpMax = this._calcStat('mp', 1, 70);
        this.str = this._calcStat('str');
        this.def = this._calcStat('def');
        this.mgi = this._calcStat('mgi');
        this.res = this._calcStat('res');
        this.dex = this._calcStat('dex');
        this.lck = this._calcStat('lck');
    }

    /**
     *
     * @param stat
     * @param base
     * @param prog
     * @returns {number}
     * @private
     */
    _calcStat(stat, base = 1, prog = 5) {
        return this.data[stat] * base + Math.floor(this.data[stat] * prog * this.lvl / 100);
    }

    /**
     *
     * @param battle
     * @param fn
     */
    ai(battle, fn) {
        let rand = _.random(1, 100);
        let actions = this.data.actions;
        let sum = 0;
        let i = 0;
        let a;
        do {
            a = actions[i];
            sum += a.rate;
            i++;
        } while (rand > sum && i < actions.length);

        return new ActionEnemy(this, a);
    }

    /**
     *
     * @returns {*}
     */
    save() {
        return _.pick(this, 'ref');
    }

}