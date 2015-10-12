import Enemy from './enemy';
import Rewards from './rewards';
import _ from 'lodash';

export default class Battle {

    constructor(game, data) {
        this.game = game;
        this.story = game.story;

        this.init();
    }

    init() {

        // list of enemies to fight
        // Enemy[]
        this.enemies = [];

        // if battle is win
        this.rewards = null;

        // if battle is lost
        this.lost = 0;

        // boss battle?
        this.boss = false;
        
        // no of enemies wave
        this.wave = 1;

        // selected target: unit
        this.target = null;
    }

    /**
     *
     * @param data
     */
    load(data) {
        for (let i of data.enemies) {
            this.enemies.push(Enemy.get(this, i));
        }

        if (data.lost) {
            this.lost = data.lost;
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
     */
    chooseBoss() {
        let boss = this.story.data.boss;

        this.boss = true;

        for (let e of boss) {
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
        for (let i of this.units()) {
            i.run();
        }

        // list of actions
        this.actions = [];

        // checking status
        this.checking = false;
    }
    
    /**
     * 
     */
    pause() {
        
    }

    /**
     * Check for actions (todo: or events)
     */
    check() {

        // if no actions
        if (this.actions.length > 0 || this.checking) return;

        // checking status
        this.checking = true;

        /// action ends when animation ends
        this.actions.shift().run(() => {

            // end battle
            let health = this.getHealth();
            if (health.team == 0 || health.enemies == 0) {
                this.end((health.team > 0));
                return;
            }

            // checking status
            this.checking = false;

            // recursive until actions is empty
            this.check();

        });
    }

    /**
     * Add an action for future checking
     * @param action
     */
    addAction(action) {
        this.actions.push(action);
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
     * @param victory
     */
    end(victory) {
        console.log('[BATTLE ENDS]');

        if (victory) {
            this.rewards = new Rewards(this);

            // chain up
            this.game.story.chain++;

            // complete story if boss battle
            if (this.boss) {
                this.game.story.complete();
            }

            // [saving]
            this.game.save();

            this.game.$location.path('/rewards');

        } else {
            this.lost++;

            // chain break
            this.game.story.chain = 0;

            // [saving]
            this.game.save();

            this.game.$location.path('/lost');
        }
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

        if (this.boss) {
            save.boss = true;
        }

        save.enemies = [];
        for (let i of this.enemies) {
            save.enemies.push(i.ref);
        }

        if (this.lost > 0) {
            save.lost = this.lost;
        }

        if (this.rewards) {
            save.rewards = this.rewards.save();
        }

        return save;
    }

}