import Action from '../action';

export default class ActionAttack extends Action {

    constructor(character) {
        super(character);
    }

    execute(fn) {
        let alive = _.filter(this.battle.enemies, (u) => {
            return u.hp > 0;
        });
        let unit = _.sample(alive);
        let damage = this.getHits(this.character, unit);
        this.animAttack(unit, damage, fn);
        console.log(this.character.data.ref, 'attacked!');
    }

}