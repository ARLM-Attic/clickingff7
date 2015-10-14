import Unit from './unit';
import Weapon from './equipment/weapon';
import ActionAttack from './actions/attack';
import ActionMateria from './actions/materia';
import ActionDefense from './actions/defense';
import ActionLimit from './actions/limit';
import _ from 'lodash';

export default class Character extends Unit {

    constructor(game, data) {

        super(game, data);

        if (!this.weapon) this.weapon = null;
        if (!this.armor) this.armor = null;
        if (!this.accessory) this.accessory = null;

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

        // hp
        this.hp = data.hp;

        // mp
        this.mp = data.mp;

        // xp
        this.xp = data.xp;

        // status
        this.status = data.status;

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
     * @returns {string}
     */
    getStatusImg() {
        let img;
        if (this.status == 'attack') img = 'weapons/' + this.data.weapon.type;
        if (this.status == 'defense') img = 'armor';
        return '/img/icons/' + img + '.png';
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
            
            this.battle.history.add('battle', this.ref + ' went to level ' + this.lvl);

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
     * Actions from materia equipment
     */
    refreshActions() {
        this.actions = this.getActionsFromEquipment();
        // todo add limit action
        //this.actions.unshift(new ActionLimit(this));
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
    getActionsFromEquipment() {
        let materias = [], actions = [];

        // grab "green" materias from weapon & armor

        if (this.weapon) {
            materias = _.union(materias, _.where(this.weapon.materias, {color: 'green'}));
        }
        if (this.armor) {
            materias = _.union(materias, _.where(this.armor.materias, {color: 'green'}));
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

        var res = _.pick(this, 'id', 'lvl', 'hp', 'mp', 'xp', 'ref', 'status', 'active');

        if (this.defense) {
            res.defense = true;
        }

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