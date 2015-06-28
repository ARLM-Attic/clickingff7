import Action from '../action';

export default class ActionMateria extends Action {

    constructor(character, materia) {
        super(character);

        // attach materia to this action
        this.materia = materia;
    }

    isAvailable() {
        return (this.materia.cost <= this.character.mp)
    }

    execute() {
        return this.materia.execute();
    }

}