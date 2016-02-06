import _ from 'lodash';

export default class Store {

    constructor() {
        this.characters = [];
        this.weapons = [];
        this.armors = [];
        this.accessories = [];
        this.materias = [];
        this.stories = [];
        this.enemies = [];
        this.limits = [];
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

    getArmor(ref) {
        try {
            return _.find(this.armors, {ref: ref});
        } catch (err) {
            throw new Error('Armor not found');
        }
    }

    getAccessory(ref) {
        try {
            return _.find(this.accessories, {ref: ref});
        } catch (err) {
            throw new Error('Accessory not found');
        }
    }

    getMateria(ref) {
        try {
            return _.find(this.materias, {ref: ref});
        } catch (err) {
            throw new Error('Materia not found');
        }
    }

    getStory(ref) {
        try {
            return _.find(this.stories, {ref: ref});
        } catch (err) {
            throw new Error('Story not found');
        }
    }

    getScene(ref) {
        try {
            return _.find(this.scenes, {ref: ref});
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

    getLimit(ref) {
        try {
            return _.find(this.limits, {ref: ref});
        } catch (err) {
            throw new Error('Limit not found');
        }
    }

}