import Enemy from './enemy';
import Rewards from './rewards';
import _ from 'lodash';

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

        // select current character
        this.character = this.game.team[0];
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
     * Returns alive units
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
        // get TS units
        for (let i of this.units()) {
            let ts = i.getTS();
            i.ts = ts;
            let base = _.random(3 * ts);
            i.cts = base;
            i.fts = base;
        }

        this.run();
    }

    /**
     * DO THE BATTLE
     */
    run() {
        this.timer = this.game.$timeout(() => {

            // check end
            let health = this.getHealth();
            if (health.team == 0 || health.enemies == 0) {
                this.game.$timeout.cancel(this.timer);
                this.end();
                return;
            }

            this.refreshTours();

            let unit = this._takeUnit("cts");

            // make his move
            unit.ai(this, () => {

                // when his move over, go next turn
                this.run();

            });
        }, 1500);
    }

    /**
     * Get the 7 next player turns
     * @returns {Array}
     */
    refreshTours() {
        this.turns = [];

        // reset sum ts
        for (let i of this.units()) {
            i.sts = 0;
        }

        // future ts
        for (let i = 0; i < 7; i++) {
            let unit = this._takeUnit('fts');
            this.turns.push(_.pick(unit, 'ref', 'fts'));
        }
    }

    /**
     *
     * @param attr {String}
     * @returns {*|number}
     * @private
     */
    _takeUnit(attr) {

        let units = this.units();

        // choose the fastest unit
        let unit = _.min(units, attr);

        // move all units
        for (let j of units) {
            j[attr] -= unit[attr];
            j.sts += unit[attr];
        }

        // reset ctr|fts
        unit[attr] = 3 * unit.ts;

        return unit;
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

        this.game.$location.path('/rewards');
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