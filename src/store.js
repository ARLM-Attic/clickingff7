export default class Store {

    constructor() {
        this.characters = [];
        this.weapons = [];
        this.stories = [];
    }

    getCharacter(ref) {
        try {
            let c = _.find(this.characters, {ref: ref});
            c.ref = ref;
            return c;
        } catch (err) {
            throw new Error('Character not found');
        }
    }

    getWeapon(type, ref) {
        try {
            let w = _.find(this.weapons, {ref: ref});
            w.ref = ref;
            w.type = type;
            return w;
        } catch (err) {
            throw new Error('Weapon not found');
        }
    }

    getStory(ref) {
        try {
            return _.find(this.stories, {ref: ref});
        } catch (err) {
            throw new Error('Story not found');
        }
    }

    getEnemy(ref) {
        try {
            return _.find(this.enemies, {ref: ref});
        } catch (err) {
            throw new Error('Enemy not found');
        }
    }

}