import Action from '../action';
import _ from 'lodash';

export default class ActionEnemy extends Action {

    constructor(unit, action) {
        super(unit);

        this.action = action;
    }

    execute(fn) {
        let targets = this.getTargets(this.action.targets);

        let damages = this.getDamages(this.action.type, this.action.pwr, targets);

        this.animAttack(targets, damages, fn);

        console.log(this.unit.ref, this.action.ref);
    }

}