import Enemy from './enemy';

export default class Battle {

    constructor(game, story) {
        this.game = game;
        this.story = story;

        // list of actions to execute
        // Action[]
        this.actionsPanel = [];

        // choose enemies
        this.chooseEnemies();

        // check actions
        this.run();
        console.log('[BATTLE BEGINS]');
    }

    /**
     *
     */
    chooseEnemies() {
        let enemies = this.story.data.enemies;
        let nbr = _.random(1, 3);
        let choose = _.sample(enemies, nbr);

        this.enemies = [];
        for (let e of choose) {
            this.enemies.push(Enemy.get(this, e));
        }
    }

    /**
     *
     * @returns {Array|*}
     */
    units() {
        var units;
        units = _.union(this.game.team, this.enemies);
        units = _.filter(units, (u) => {
            return u.hp > 0;
        });
        return units;
    }

    /**
     * DO THE BATTLE
     */
    run() {
        // check end
        if (this.checkEnd()) {
            this.game.$timeout.cancel(this.timer);
            this.end();
            return;
        }

        // move all units
        var units = this.units();
        for (var u of units) {
            u.atb += u.dex;
        }

        // choose the fastest unit
        var unit = _.max(units, "atb");

        // set its atb to 0
        unit.atb = 0;

        // make his move
        unit.ai(this, () => {

            // when his move over, go next turn
            this.timer = this.game.$timeout(() => {
                this.run();
            }, 2000);

        });
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
     * @returns {boolean}
     */
    checkEnd() {
        var sumHpAllies = _.reduce(this.game.team, function (sum, ally) {
            return sum + ally.hp;
        }, 0);

        var sumHpEnemies = _.reduce(this.enemies, function (sum, ally) {
            return sum + ally.hp;
        }, 0);

        return (sumHpAllies == 0 || sumHpEnemies == 0);
    }

    /**
     *
     */
    end() {
        console.log('[BATTLE ENDS]');
    }

}