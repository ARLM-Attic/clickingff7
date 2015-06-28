import Action from '../action';

export default class ActionDefense extends Action {

    constructor(character) {
        super(character);
    }

    execute() {
        return this.character.str;
    }

}