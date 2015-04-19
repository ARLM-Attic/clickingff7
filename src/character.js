export default class Character {

    constructor(game, data, inTeam = false) {

        // game reference
        this.game = game;

        // character is active (in team)
        this.inTeam = inTeam;

        // load character data
        this.load(data);

        // level
        this.lvl = 1;

    }

    load(data) {
        for (let i in data) {
            this[i] = data[i];
        }
    }

}