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

    getStory(nbr) {
        try {
            let s = this.stories[nbr];
            s.nbr = nbr;
            return s;
        } catch (err) {
            throw new Error('Story not found');
        }
    }

}