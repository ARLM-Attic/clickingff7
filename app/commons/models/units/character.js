import Unit from '../unit';
import Limit from '../limit';
import ActionAttack from '../actions/attack';
import ActionMateria from '../actions/materia';
import ActionDefense from '../actions/defense';
import ActionLimit from '../actions/limit';
import _ from 'lodash';

export default class Character extends Unit {

    constructor(game, data) {

        super(game, data);

        if (!this.relic) this.relic = null;

        // defense mode
        if (!this.status) {
            this.status = 'attack';
        }
    }

    /**
     *
     * @param game
     * @param ref
     */
    static get(game, ref) {
        let c = new Character(game);

        c.data = game.store.getCharacter(ref);

        // level
        c.lvl = 1;

        // stats according the level
        c.calcStats();

        // limit
        let limit = Limit.get(game, c.data.limit);
        game.addLimit(limit);
        c.limit = limit;

        // actions
        c.refreshActions();

        // css reference
        c.id = _.uniqueId('i');

        // ref
        c.ref = ref;

        // fill hp & mp
        c.recover();

        // lp
        c.lp = 0;

        // xp
        c.xp = 0;

        return c;
    }

    /**
     *
     * @param data
     */
    load(data) {
        this.data = this.game.store.getCharacter(data.ref);

        // level
        this.lvl = data.lvl;

        // stats according the level
        this.calcStats();

        // relic
        if (data.relic) {
            let relic = _.find(this.game.relics, {id: data.relic.id});
            this.equip(relic, data.relic.materias);
        }

        // limit
        this.limit = _.find(this.game.limits, {id: data.limit.id});

        // actions
        this.refreshActions(data.actions);

        // css reference
        this.id = data.id;

        // ref
        this.ref = data.ref;

        // hp
        this.hp = data.hp;

        // mp
        this.mp = data.mp;

        // lp
        this.lp = data.lp;

        // xp
        this.xp = data.xp;

        // status
        this.status = data.status;

        // team or backup
        this.active = data.active;
    }

    get lpMax() {
        return this.lvl * 100;
    }

    /**
     *
     */
    calcStats() {
        this.hpMax = this._calcStat('hp', 10, 700);
        this.mpMax = this._calcStat('mp', 1, 70);
        this.str = this._calcStat('str');
        this.def = this._calcStat('def');
        this.mgi = this._calcStat('mgi');
        this.res = this._calcStat('res');
        this.dex = this._calcStat('dex');
        this.lck = this._calcStat('lck');
        this.xpMax = this._calcStat('lck', 100);
    }

    /**
     *
     * @param stat
     * @param base
     * @param prog
     * @returns {number}
     * @private
     */
    _calcStat(stat, base = 1, prog = 10) {
        return this.data[stat] * base + Math.floor(this.data[stat] * prog * this.lvl / 100);
    }

    /**
     *
     */
    team() {
        this.active = true;
    }

    /**
     *
     */
    backup() {
        this.active = false;
    }

    /**
     *
     * @returns {string}
     */
    getStatusImg() {
        return 'resources/images/icons/accessory.png';
    }

    /**
     *
     * @returns {boolean}
     */
    inStory() {
        return ($.inArray(this.ref, this.game.story.data.characters) >= 0);
    }

    /**
     *
     * @param relic
     * @param materias
     */
    equip(relic, materias) {
        this.relic = relic;

        let stats = relic.data.stats;
        for (let i in stats) {
            this[i] += stats[i];
        }

        // load materias
        this.relic.loadMaterias(materias);
    }

    /**
     *
     */
    unequip() {
        let relic = this.relic;
        if (relic) {
            this.relic = undefined;

            let stats = relic.data.stats;
            for (let i in stats) {
                this[i] -= stats[i];
            }

            relic.removeAllMateria();
        }
    }

    /**
     *
     * @param xp
     */
    setXp(xp) {
        this.xp += xp;
        while (this.xp >= this.xpMax) {
            this.xp -= this.xpMax;
            this.lvl++;

            this.battle.history.add('battle', this.ref + ' went to level ' + this.lvl);

            // updating stats
            this.calcStats();
        }
    }

    /**
     *
     * @param lp
     */
    setLp(lp) {
        this.lp += lp;
    }

    /**
     *
     * @returns {number}
     */
    get xpRemain() {
        return this.xpMax - this.xp;
    }

    /**
     * Actions from materia equipment
     */
    refreshActions() {
        this.actions = this.getActionsFromRelic();
        this.actions.unshift(new ActionLimit(this));
    }

    /**
     *
     * @returns {*}
     */
    ai(battle, fn) {
        if (this.status == 'attack') {
            return new ActionAttack(this);
        } else if (this.status == 'defense') {
            return new ActionDefense(this);
        }
    }

    /**
     *
     * @returns {Array}
     */
    getActionsFromRelic() {
        let materias = [], actions = [];

        // grab "green" materias from relic

        if (this.relic) {
            materias = _.union(materias, _.where(this.relic.materias, {color: 'green'}));
        }

        // sort by materia level

        for (let m of materias) {

            let action = _.find(actions, (e) => {
                return (e.materia.ref == m.ref);
            });

            if (!action) {
                action = new ActionMateria(this, m);
                action.rate = 0;
                action.lvl = 0;
                actions.push(action);
            }

            if (action.active) {
                action.rate += 20;
            }
        }

        return actions;
    }

    /**
     *
     * @returns {*}
     */
    save() {
        let materias;

        var res = _.pick(this, 'id', 'lvl', 'hp', 'mp', 'lp', 'xp', 'ref', 'status', 'active');

        if (this.defense) {
            res.defense = true;
        }

        if (this.relic) {
            res.relic = _.pick(this.relic, 'id');
            if (this.relic.materias.length > 0) {
                res.relic.materias = _.map(this.relic.materias, 'id');
            }
        }

        res.limit = _.pick(this.limit, 'id');

        return res;
    }

}