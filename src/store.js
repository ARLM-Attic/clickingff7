export default class Store {

    constructor() {
        this.characters = [];
        this.weapons = [];
        this.stories = [];
        this.enemies = [];
    }

    getCharacter(ref) {
        try {
            return _.find(this.characters, {ref: ref});
        } catch (err) {
            throw new Error('Character not found');
        }
    }

    getWeapon(ref) {
        try {
            return _.find(this.weapons, {ref: ref});
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