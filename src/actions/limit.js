import Action from '../action';

export default class ActionLimit extends Action {

    constructor(unit) {
        super(unit);

        this.ref = 'limit';

        this.img = 'img/icons/limit.png';
    }

    isAvailable() {
        return (this.unit.limit == this.unit.limitMax);
    }

    execute() {
        return this.materia.execute();
    }

}