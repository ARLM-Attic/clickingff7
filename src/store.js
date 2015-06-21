export default class Store {

    constructor() {
        this.characters = [];
        this.weapons = [];
        this.stories = [];
    }

    getCharacter(name) {
        try {
            let c = this.characters[name];
            c.name = name;
            return c;
        } catch (err) {
            throw new Error('Character not found');
        }
    }

    getWeapon(type, name) {
        try {
            let w = this.weapons[type][name];
            w.name = name;
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