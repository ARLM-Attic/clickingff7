import _ from 'lodash';
import Action from '../action';

export default class ActionMateria extends Action {

    constructor(character, materia) {
        super(character);

        // attach materia to this action
        this.materia = materia;

        // additive level
        this.lvl = 1;

        this.ref = materia.ref;
        this.rate = 20;
        this.img = 'img/icons/materias/' + materia.color + '.png';
    }

    isAvailable() {
        return (this.materia.cost <= this.character.mp)
    }

    execute(fn) {
        let targets = this.getTargets(this.materia.data.targets);

        // Each lvl>2 pwr+10%
        let pwr = this.materia.data.pwr * (1 + 0.1 * (this.materia.lvl - 1));

        let damages = this.getDamages(this.materia.data.type, pwr, targets);

        this.animAttack(targets, damages, fn);

        console.log(this.character.ref, this.materia.ref);
    }

}