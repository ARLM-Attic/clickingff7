export default class Equipment {

    constructor(game, data) {

        // game reference
        this.game = game;

        // load weapon data
        if (data) {
            this.load(data);
        }
    }

    save() {
        let save = {};
        save.ref = this.data.ref;
        return save;
    }

}