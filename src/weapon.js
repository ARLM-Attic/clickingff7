export default class Weapon {

    constructor(game, data) {

        // game reference
        this.game = game;

        // load weapon data
        this.load(data);
    }

    load(data) {
        this.data = data;
    }

}