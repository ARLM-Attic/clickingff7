import Unit from './unit';

export default class Enemy extends Unit {

    static get(game, ref) {
        let c = new Enemy(game);

        c.data = game.store.getEnemy(ref);

        // fill hp & mp
        c.recover();

        return c;
    }

    load(data) {
        this.data = this.game.store.getEnemy(data.ref);

        // fill hp & mp
        this.recover();
    }

    /**
     * Recover HP & MP
     */
    recover() {
        this.hp = this.data.hp;
        this.hpMax = this.data.hp;
    }

}