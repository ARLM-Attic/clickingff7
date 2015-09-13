import Unit from './unit';
import Weapon from './equipment/weapon';
import ActionAttack from './actions/attack';
import ActionDefense from './actions/defense';
import ActionLimit from './actions/limit';
import ActionMateria from './actions/materia';
import _ from 'lodash';

export default class Character extends Unit {

    constructor(game, data) {

        this.weapon = null;
        this.armor = null;
        this.accessory = null;

        super(game, data);
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

        // initial weapon
        let weapon = Weapon.get(game, c.data.weapon.ref);
        game.addWeapon(weapon);
        c.equip(weapon);

        // actions
        c.refreshActions();

        // css reference
        c.id = _.uniqueId('i');

        // ref
        c.ref = ref;

        // fill hp & mp
        c.recover();

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

        // weapon
        if (data.weapon) {
            let weapon = _.find(this.game.weapons, {id: data.weapon.id});
            this.equip(weapon, data.weapon.materias);
        }

        // armor
        if (data.armor) {
            let armor = _.find(this.game.armors, {id: data.armor.id});
            this.equip(armor, data.armor.materias);
        }

        // accessory
        if (data.accessory) {
            let accessory = _.find(this.game.accessories, {id: data.accessory.id});
            this.equip(accessory, {});
        }

        // actions
        this.refreshActions(data.actions);

        // css reference
        this.id = data.id;

        // ref
        this.ref = data.ref;

        // fill hp & mp
        this.recover();

        // xp
        this.xp = data.xp;

        // team or backup
        this.active = data.active;
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
     * @param equipment
     * @param materias
     */
    equip(equipment, materias) {
        let type = equipment.getType();
        this[type] = equipment;

        let stats = equipment.data.stats;
        for (let i in stats) {
            this[i] += stats[i];
        }

        // load materias
        this[type].loadMaterias(materias);
    }

    /**
     *
     * @param type
     */
    unequip(type) {
        let equipment = this[type];
        if (equipment) {
            this[type] = undefined;

            let stats = equipment.data.stats;
            for (let i in stats) {
                this[i] -= stats[i];
            }

            equipment.removeAllMateria();
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

            // updating stats
            this.calcStats();
        }
    }

    /**
     *
     * @returns {number}
     */
    get xpRemain() {
        return this.xpMax - this.xp;
    }

    /**
     *
     * @param data
     */
    refreshActions(data = []) {
        let res = [], opt;

        // [1]
        opt = _.find(data, {ref: 'attack'});
        res.push(new ActionAttack(this, opt));

        // [1]
        //res.push(new ActionDefense(this));

        // [0-1] current limit of character
        //res.push(new ActionLimit(this));

        // [0-4] get actions from materias on weapon
        let a = this.getActionsFromEquipment();
        for (let i of a) {
            res.push(i);
        }

        this.actions = res;
    }

    /**
     *
     * @returns {*}
     */
    ai(battle, fn) {
        let activeActions = _.filter(this.actions, 'enabled');
        if (activeActions.length > 0) {
            let action = _.sample(activeActions);
            action.setBattle(battle);
            action.execute(fn);
        } else {
            fn();
        }
    }

    /**
     *
     * @returns {Array}
     */
    getActionsFromEquipment() {
        let materias = [], actions = [];

        // grab "green" materias from weapon & armor

        if (this.weapon) {
            materias = _.union(materias, _.where(this.weapon.materias, {color: 'green'}));
        }
        if (this.armor) {
            materias = _.union(materias, _.where(this.armor.materias, {color: 'green'}));
        }

        console.log(this.data.ref, materias);

        // sort by materia level

        for (let m of materias) {

            let action = _.find(actions, (e) => {
                return (e.materia.ref == m.ref);
            });
            if (action) {
                action.lvl += m.lvl;
            } else {
                let a = new ActionMateria(this, m);
                a.lvl = m.lvl;
                actions.push(a);
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

        var res = _.pick(this, 'id', 'lvl', 'xp', 'ref', 'active');

        if (this.weapon) {
            res.weapon = _.pick(this.weapon, 'id');
            materias = this.weapon.getMateriaIds();
            if (!_.isEmpty(materias)) {
                res.weapon.materias = materias;
            }
        }

        if (this.armor) {
            res.armor = _.pick(this.armor, 'id');
            materias = this.armor.getMateriaIds();
            if (!_.isEmpty(materias)) {
                res.armor.materias = materias;
            }
        }

        if (this.accessory) {
            res.accessory = _.pick(this.accessory, 'id');
        }

        // save activated actions
        res.actions = [];
        for (let i of this.actions) {
            res.actions.push(i.save());
        }

        return res;
    }

}