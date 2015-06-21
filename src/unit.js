export default class Unit {

    constructor(game, data) {
        // game reference
        this.game = game;

        // battle initiative
        this.sum = 0;

        // load unit data
        if (data) {
            this.load(data);
        }
    }

    getMove() {
        // todo handle effects like stop/haste/..
        return this.dex;
    }

    attack() {
        // todo
    }

}