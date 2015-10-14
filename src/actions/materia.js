import _ from 'lodash';
import Action from '../action';

export default class ActionMateria extends Action {

    constructor(unit, materia) {
        super(unit);

        // attach materia to this action
        this.materia = materia;

        // additive level
        this.lvl = 1;

        this.ref = materia.ref;
        this.img = 'img/icons/materias/' + materia.color + '.png';
    }

    isAvailable() {
        return (this.materia.data.cost <= this.unit.mp && !this.using);
    }

    execute(fn) {

        // materia cost
        this.unit.mp -= this.materia.data.cost;

        let targets = this.getTargets(this.materia.data.targets);

        // Each lvl>2 pwr+10%
        let pwr = this.materia.data.pwr * (1 + 0.1 * (this.materia.lvl - 1));

        let damages = this.getDamages(this.materia.data.type, pwr, targets);

        this.animAttack(targets, damages, fn);

        this.battle.history.add('battle', this.unit.ref + ' attacks with ' + this.ref + ' and deals ' + damages.hits + ' damages');
    }

}