import Enemy from './enemy';

export default class Battle {

    constructor(game) {
        this.game = game;
        this.chooseEnemies();
        this.run();
    }

    chooseEnemies() {
        let groups = this.story().enemies;
        let group = _.sample(groups);

        this.enemies = [];
        for (let e of group) {
            this.enemies.push(Enemy.get(this.game, e));
        }
    }

    story() {
        return this.game.story.data;
    }

    /**
     * DO THE BATTLE
     */
    run() {

    }

    nextTurn() {
        let auto = false;
        let turns = this.getTurns();
        let unit = turns[0];
        let playerTurn = unit.constructor.name == 'Character';

        // choose default enemy target
        if (!this.target) {
            this.target = this.enemies[0];
        }

        if (playerTurn || auto) { // <-- HERE
            unit.attack(() => {
                this.nextTurn();
            });
        } else {
            this.currentUnit = unit;
        }
    }

    execute(type, args = []) {
        let name;
        switch (type) {
            case 'attack':
                this.currentUnit.attack(() => {
                    this.nextTurn();
                });
                break;
            case 'guard':
                unit.guard();
                break;
            case 'materia':
                name = [0];
                unit.materia(name);
                break;
            case 'item':
                name = args[0];
                unit.item(name);
                break;
        }
    }

    /**
     * Get the next turns actions
     * @returns {Array}
     */
    getTurns() {
        // gathering everyone
        let units = _.union(this.game.team, this.enemies);

        // initialize
        let sums = {};
        for (let i of units) {
            sums[i.data.name] = 0;
        }

        // simulating
        let turns = [];
        while (turns.length < 6) {
            for (let i of units) {
                i.sum += i.getMove();
            }
            let unit = _.max(units, 'sum');
            unit.sum = 0;
            turns.push(unit);
        }

        return turns;
    }

    end() {
        // todo handle rewards

        this.battleNo++;

        if (this.battleNo <= this.getPart().battles) {
            this.run();
        } else {
            // clean registy
            console.log('[BATTLE ENDS]');
            this.getStory().nextPart(this.partNo);
            this.game.battle = null;
            this.game.story = null;
            this.game.save();
            this.game.mode = 'free';
            this.game.$location.path('/story');
        }
    }

    /**
     * todo save team hp/mp + enemies
     * @returns {*}
     */
    save() {
        let save = _.pick(this, 'storyNo', 'partNo', 'battleNo');

        save.enemies = [];
        for (var e of this.enemies) {
            save.enemies.push(e.data.name);
        }

        return save;
    }

}