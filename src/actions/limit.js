import Action from '../action';

export default class ActionLimit extends Action {

    constructor(character) {
        super(character);
    }

    isAvailable() {
        return (this.character.limit == this.character.limitMax);
    }

    execute() {
        return this.materia.execute();
    }

}