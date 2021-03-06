import Enemy from './units/enemy';
import History from './history';
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
        this.wave = 0;

        // list of system actions
        this.actions = [];

        // list of player actions
        this.playerActions = [];

        // selected target: unit
        this.target = null;

        // history logs
        this.history = new History();
    }

    /**
     *
     * @param data
     */
    load(data) {
        for (let i of data.enemies) {
            this.enemies.push(Enemy.get(this, i));
        }

        if (data.boss) {
            this.boss = data.boss;
        }

        this.wave = data.wave;
    }

    /**
     * Choose randomly enemies & update wave number
     */
    chooseEnemies() {
        let enemies = this.story.data.enemies;
        let nbr = 1;//_.random(1, 3);
        let choose = _.sample(enemies, nbr);

        this.wave++;
        this.enemies = [];
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

        this.enemies = [];
        for (let e of boss) {
            this.enemies.push(Enemy.get(this, e));
        }
    }

    /**
     *
     */
    canFightBoss() {
        return (this.wave > 10);
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
     * Units begin to fight
     */
    start() {
        this.history.add('battle', 'New wave #' + this.wave);

        // list of actions
        this.actions = [];

        // todo list of events
        this.events = [];

        for (let i of this.units()) {
            if (!i.battle) {
                i.setBattle(this);
            }
            i.cts = 0;
        }

        // check events before the battle begins
        this.check();
    }

    /**
     * Units move
     */
    run() {
        this.timer = this.game.$timeout(() => {

            // move all units
            for (let i of this.units()) {
                if (i.cts < i.ctsMax) {
                    i.cts += 100;
                }
                if (i.cts >= i.ctsMax) {
                    this.addAction(i.ai(this));
                }
            }

            this.check();

        }, 100);
    }

    /**
     * Units stop
     */
    stop() {
        this.game.$timeout.cancel(this.timer);
    }

    /**
     *
     * Check for actions, playerActions (todo: or events)
     * Check function ends with calling to run()
     * @param fn
     */
    check(fn) {

        // start checking
        this.stop();

        // no checking
        let actions = _.union(this.playerActions, this.actions);
        if (actions.length == 0) {
            this.run();
            return;
        }

        // checking the oldest action
        let action;
        let isAction = false;
        let isPlayerAction= false;
        if (this.playerActions.length > 0) {
            action = this.playerActions.shift();
            isPlayerAction = true;
        } else if (this.actions.length > 0) {
            action = this.actions.shift();
            isAction = true;
        }

        action.setBattle(this);
        action.execute(() => {

            // free the action
            action.using = false;

            // checking health
            let health = this.getHealth();

            if (health.team == 0) {

                // chain fail
                this.game.story.chain = 0;

                // [saving]
                this.game.save();

                // redirect
                this.game.$location.path('/home');
                this.game.$rootScope.$apply();
                return;
            }

            if (health.enemies == 0) {

                // complete story if boss battle
                if (this.boss) {

                    // story complete
                    this.game.story.complete();

                    // end this battle
                    this.game.battle = null;

                    // [saving]
                    this.game.save();

                    // redirect
                    this.game.$location.path('/home');
                    this.game.$rootScope.$apply();
                    return;
                }

                // chain success
                this.game.story.chain++;

                // new enemies wave
                this.chooseEnemies();

                // [saving]
                this.game.save();

                // battle begin
                this.start();
                return;
            }

            if (isAction) {
                // resuming unit cts
                action.unit.cts = 0;
            }

            // recursive until actions is empty
            this.check();

        });
    }

    /**
     * Add an action (by system)
     * @param action
     */
    addAction(action) {
        this.actions.push(action);
        action.using = true;
    }

    /**
     * Add an action (by player)
     * @param action
     */
    addPlayerAction(action) {
        this.playerActions.push(action);
        action.using = true;
    }

    /**
     *
     * @returns {{}}
     */
    getHealth() {
        let res = {};

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
     * @returns {{}}
     */
    save() {
        let save = _.pick(this, 'wave');

        save.enemies = [];
        for (let i of this.enemies) {
            save.enemies.push(i.ref);
        }

        if (this.boss) {
            save.boss = true;
        }

        return save;
    }

}