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

        // initial weapon
        c.weapon = Weapon.get(game, c.data.weapon.ref);

        // level
        c.lvl = 1;

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

        // weapon
        this.weapon = new Weapon(this.game, this.data.weapon);

        // level
        this.lvl = data.lvl;

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
     * @returns {number}
     */
    get xpMax() {
        return this.lvl * 100;
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