import Unit from './unit';

export default class Enemy extends Unit {

    static get(battle, ref) {
        let c = new Enemy(battle.game);

        c.data = battle.game.store.getEnemy(ref);

        // level
        c.lvl = battle.story.data.level;

        // css reference
        c.id = _.uniqueId(ref);

        // fill hp & mp
        c.recover();

        return c;
    }

    load(data) {
        this.data = this.game.store.getEnemy(data.ref);

        // css reference
        c.id = _.uniqueId(data.ref);

        // fill hp & mp
        this.recover();
    }

}