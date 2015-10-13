import Action from '../action';
import _ from 'lodash';

export default class ActionAttack extends Action {

    constructor(unit, data) {
        super(unit, data);

        this.ref = 'attack';

        this.img = 'img/icons/weapons/' + unit.data.weapon.type + '.png';
    }

    execute(fn) {
        let targets = this.getTargets('enemy:1');

        let damages = this.getDamages('phy', 1, targets);

        this.animAttack(targets, damages, fn);

        console.log(this.unit.ref, 'attack');
    }

}