import Unit from './unit';
import Weapon from './weapon';
import ActionAttack from './actions/attack';
import ActionDefense from './actions/defense';
import ActionLimit from './actions/limit';
import ActionMateria from './actions/materia';

export default class Character extends Unit {

    constructor(game, data) {
        super(game, data);

        this.weapon = null;
        this.armor = null;
        this.accessory = null;
        this.limit = null;
    }

    static get(game, ref) {
        let c = new Character(game);

        c.data = game.store.getCharacter(ref);

        // initial weapon
        c.weapon = Weapon.get(game, c.data.weapon.ref);

        // level
        c.lvl = 1;

        // css reference
        c.id = _.uniqueId(ref);

        // fill hp & mp
        c.recover();

        c.refreshActions();

        return c;
    }

    load(data) {
        this.data = this.game.store.getCharacter(data.ref);

        // weapon
        this.weapon = new Weapon(this.game, this.data.weapon);

        // level
        this.lvl = data.lvl;

        // css reference
        this.id = _.uniqueId(data.ref);

        // fill hp & mp
        this.recover();

        this.refreshActions();
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

    save() {
        var save = _.pick(this, 'lvl');

        save.ref = this.data.ref;
        save.weapon = this.weapon.save();

        return save;
    }

}