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

    getStory(storyNo) {
        try {
            let s = this.stories[storyNo];
            s.storyNo = storyNo;
            return s;
        } catch (err) {
            throw new Error('Story not found');
        }
    }

    getEnemy(storyNo, name) {
        try {
            let e = this.enemies[storyNo][name];
            e.storyNo = storyNo;
            e.name = name;
            return e;
        } catch (err) {
            throw new Error('Enemy not found');
        }
    }

}