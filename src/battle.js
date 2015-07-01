import Enemy from './enemy';
import Rewards from './rewards';

export default class Battle {

    constructor(game, data) {
        this.game = game;
        this.story = game.story;

        this.init();

        if (data) {
            this.load(data);
        } else {
            this.chooseEnemies();
        }
    }

    init() {
        // list of actions to execute
        // Action[]
        this.actionsPanel = [];

        // list of enemies to fight
        // Enemy[]
        this.enemies = [];

        // Battle rewards
        this.rewards = null;
    }

    /**
     *
     * @param data
     */
    load(data) {
        for (let i of data.enemies) {
            this.enemies.push(Enemy.get(this, i));
        }

        if (data.rewards) {
            this.rewards = new Rewards(this, data.rewards);
        }
    }

    /**
     *
     */
    chooseEnemies() {
        let enemies = this.story.data.enemies;
        let nbr = 1;//_.random(1, 3);
        let choose = _.sample(enemies, nbr);

        for (let e of choose) {
            this.enemies.push(Enemy.get(this, e));
        }
    }

    /**
     *
     * @returns {Array|*}
     */
    units() {
        let units;
        units = _.union(this.game.team, this.enemies);
        units = _.filter(units, (u) => {
            return u.hp > 0;
        });
        return units;
    }

    /**
     *
     */
    start() {
        // check actions
        console.log('[BATTLE BEGINS]');
        this.run();
    }

    /**
     * DO THE BATTLE
     */
    run() {
        console.log('');
        console.log('waiting 2s..');
        console.log('');
        this.timer = this.game.$timeout(() => {

            // check end
            let health = this.getHealth();
            if (health.team == 0 || health.enemies == 0) {
                this.game.$timeout.cancel(this.timer);
                this.end();
                return;
            }

            console.log('begin turn');

            // move all units
            let units = this.units();
            for (let u of units) {
                u.atb += u.dex;
            }

            // choose the fastest unit
            let unit = _.max(units, "atb");

            // set its atb to 0
            unit.atb = 0;

            // make his move
            console.log('-unit ai', unit.id);
            unit.ai(this, () => {

                // when his move over, go next turn
                console.log('-end turn');
                this.run();

            });
        }, 1500);
    }

    /**
     *
     * @param action
     */
    addAction(action) {
        this.actionsPanel.push(action);
    }

    /**
     *
     * @returns {{}}
     */
    getHealth() {
        var res = {};

        res.team = _.reduce(this.game.team, function (sum, ally) {
            return sum + ally.hp;
        }, 0);

        res.enemies = _.reduce(this.enemies, function (sum, ally) {
            return sum + ally.hp;
        }, 0);

        return res;
    }

    /**
     *
     */
    end() {
        console.log('[BATTLE ENDS]');
        this.rewards = new Rewards(this);

        // [saving]
        this.game.save();

        this.game.$location.path('/results');
    }

    /**
     *
     */
    quit() {
        this.game.$timeout.cancel(this.timer);
        this.game.battle = null;
    }

    /**
     *
     * @returns {{}}
     */
    save() {
        var save = {};

        save.enemies = [];
        for (let i of this.enemies) {
            save.enemies.push(i.ref);
        }

        if (this.rewards) {
            save.rewards = this.rewards.save();
        }

        return save;
    }

}