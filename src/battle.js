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
        this.wave = 0;

        // selected target: unit
        this.target = null;

        // list of actions
        this.actions = [];

        // todo list of events
        this.events = [];

        // checking status
        this.checking = false;
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
     * Units begin to fight
     */
    start() {
        for (let i of this.units()) {
            i.run();
        }
    }
    
    /**
     * todo
     */
    pause() {
        
    }

    /**
     * todo
     */
    quit() {
        for (let i of this.units()) {
            i.stop();
        }
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

            // checking health
            let health = this.getHealth();
            
            if (health.team == 0) {
                
                // chain fail
                this.game.story.chain = 0;
                
                // redirect
                this.game.$location.path('/home');
                return;
            }
            
            if (health.enemies == 0) {
                
                // complete story if boss battle
                if (this.boss) {
                    
                    // story complete
                    this.game.story.complete();
                    
                    // redirect
                    this.game.$location.path('/story');
                    return;
                }
                
                // chain success
                this.game.story.chain++;
                
                // new enemies wave
                this.chooseEnemies();
                this.start();
            }

            // checking status
            this.checking = false;

            // recursive until actions is empty
            this.check();

        });
    }

    /**
     * Add an action & check
     * @param action
     */
    addAction(action) {
        this.actions.push(action);
        this.check();
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
     * @returns {{}}
     */
    save() {
        var save = {};

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