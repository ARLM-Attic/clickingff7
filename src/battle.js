import Enemy from './enemy';

export default class Battle {

    constructor(game, data) {
        this.game = game;

        this.enemies = [];

        this.load(data);
    }

    load(data) {
        this.storyNo = data.storyNo;
        this.partNo = data.partNo;
        this.battleNo = data.battleNo;

        if (data.enemies) {
            for (let e of data.enemies) {
                this.enemies.push(Enemy.get(this.game, this.storyNo, e));
            }
        } else {
            this.chooseEnemies();
        }
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
        this.game.save();
        console.log('[BATTLE BEGINS] ' + this.storyNo + '/' + this.partNo + '+' + this.battleNo);
        this.game.$timeout(() => {
            this.end();
        }, 15000);
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