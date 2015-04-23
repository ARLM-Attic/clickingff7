import Enemy from './enemy';

export default class Battle {

    constructor(game, storyNo, partNo, battleNo) {
        this.game = game;
        this.storyNo = storyNo;
        this.partNo = partNo;
        this.battleNo = battleNo;

        this.enemies = [];
        this.chooseEnemies();

        this.run();
    }

    getStory() {
        return this.game.stories[this.storyNo - 1];
    }

    getPart() {
        return this.getStory().data.parts[this.partNo - 1];
    }

    chooseEnemies() {
        let groups = this.getPart().enemies;
        let group = _.sample(groups);
        for (let e of group) {
            this.addEnemy(this.storyNo, e);
        }
    }

    /**
     * Add an enemy
     * @param storyNo
     * @param name
     */
    addEnemy(storyNo, name) {
        this.enemies.push(Enemy.get(this.game, storyNo, name));
    }

    /**
     * DO THE BATTLE
     */
    run() {
        console.log('[BATTLE BEGINS] ' + this.storyNo + '/' + this.partNo + '+' + this.battleNo);
        this.game.$timeout(() => {
            this.end();
        }, 15000);
    }

    end() {
        // todo handle rewards

        this.battleNo++;

        if (this.battleNo <= this.getPart().battles) {
            this.game.newBattle(this.storyNo, this.partNo, this.battleNo);
        } else {
            // clean registy
            console.log('[BATTLE ENDS]');
            this.getStory().complete();
            this.game.battle = null;
            this.game.story = null;
            this.game.save();
        }
    }

    /**
     * todo save team hp/mp + enemies
     * @returns {*}
     */
    save() {
        return _.pick(this, 'storyNo', 'partNo', 'battleNo');
    }

}