export default class Enemy {

    constructor(game, data) {

        // game reference
        this.game = game;

        // load character data
        if (data) {
            this.load(data);
        }
    }

    static get(game, storyNo, name) {
        let c = new Enemy(game);

        c.data = game.store.getEnemy(storyNo, name);

        // fill hp & mp
        c.recover();

        return c;
    }

    load(data) {
        this.data = this.game.store.getEnemy(data.name);

        // fill hp & mp
        this.recover();
    }

    /**
     * Recover HP & MP
     */
    recover() {
        this.hp = this.hpMax;
        this.mp = this.mpMax;
    }

}