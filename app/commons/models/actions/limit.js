import Action from '../action';

export default class ActionLimit extends Action {

    constructor(unit) {
        super(unit);

        this.limit = this.unit.limit;

        this.img = 'resources/images/icons/limit.png';
    }

    isAvailable() {
        return (this.unit.lp >= this.unit.lpMax && !this.using);
    }

    execute(fn) {

        // limit cost
        this.unit.lp = 0;

        let targets = this.getTargets(this.limit.data.targets);

        let damages = this.getDamages(this.limit.data.type, this.limit.data.pwr, targets);

        this.animAttack(targets, damages, fn);

        this.battle.history.add('battle', this.unit.ref + ' uses his limit ' + this.limit.ref + ' and deals ' + damages.hits + ' damages');
    }

}