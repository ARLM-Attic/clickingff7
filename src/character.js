import Unit from './unit';
import Weapon from './equipment/weapon';
import ActionAttack from './actions/attack';
import ActionDefense from './actions/defense';
import ActionLimit from './actions/limit';
import ActionMateria from './actions/materia';

export default class Character extends Unit {

    constructor(game, data) {
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
        c.equip('weapon', Weapon.get(game, c.data.weapon.ref));

        // css reference
        c.id = _.uniqueId(ref);

        // ref
        c.ref = ref;

        // fill hp & mp
        c.recover();

        // xp
        c.xp = 0;

        c.refreshActions();

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
        this.equip('weapon', new Weapon(this.game, this.data.weapon));

        // css reference
        this.id = _.uniqueId(data.ref);

        // ref
        this.ref = data.ref;

        // fill hp & mp
        this.recover();

        // xp
        this.xp = data.xp;

        this.refreshActions();
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
     * @param type weapon|armor|accessory
     * @param equipment
     */
    equip(type, equipment) {
        this[type] = equipment;
        let stats = equipment.data.stats;
        for (let i in stats) {
            this[i] += stats[i];
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
     */
    refreshActions() {
        let res = [];

        // [1]
        res.push(new ActionAttack(this));

        // [1]
        //res.push(new ActionDefense(this));

        // [0-1] current limit of character
        //res.push(new ActionLimit(this));

        // [0-2] get actions from materias on weapon
        /*let a = this.weapon.getActions();
         for (let i of a) {
         res.push(i);
         }*/

        // [0-2] get actions from materias on armor
        /*let b = this.armor.getActions();
         for (let i of b) {
         res.push(i);
         }*/

        this.actions = res;
    }

    /**
     *
     * @returns {*}
     */
    ai(battle, fn) {
        let action = _.sample(this.actions);
        action.setBattle(battle);
        action.execute(fn);
    }

    /**
     *
     * @returns {*}
     */
    save() {
        var res = _.pick(this, 'lvl', 'xp', 'ref');

        res.weapon = this.weapon.save();

        return res;
    }

}