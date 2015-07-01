import Item from './item';

export default class Rewards {

    constructor(battle, data) {
        this.battle = battle;

        this.count = 5;

        if (data) {
            this.load(data);
        } else {
            this.xp = this.setXp();
            this.drops = this.setDrops();
            this.success = this.setSuccess();
        }
    }

    /**
     *
     * @returns {*}
     */
    game() {
        return this.battle.game;
    }

    /**
     *
     * @returns {$TimeoutProvider}
     */
    timeout() {
       return this.game().$timeout;
    }

    /**
     *
     * @returns {$LocationProvider}
     */
    location() {
        return this.game().$location;
    }

    /**
     *
     * @param data
     */
    load(data) {
        this.xp = data.xp;

        this.drops = [];
        if (data.drops) {
            for (let i of data.drops) {
                this.drops.push(this.loadDrop(i.type, i.ref));
            }
        }

        this.success = data.success;
    }

    /**
     *
     * @returns {number}
     */
    setXp() {
        let res = 0;

        for (let i of this.battle.enemies) {
            res += (i.data.xp) ? i.data.xp : 0;
        }

        return res;
    }

    /**
     *
     * @returns {number}
     */
    setDrops() {
        let res = 0;

        for (let i of this.battle.enemies) {
            let drop = i.data.drop;

            // next enemy if no drops
            if (!drop) continue;

            let rng = _.random(100);
            if (rng <= drop.rate) {
                //res.push(this.loadDrop(drop.type, drop.ref));
            }
        }

        return res;
    }

    setSuccess() {
        var res = false;

        var health = this.battle.getHealth();

        if (health.team > 0 && health.enemies <= 0) {
            res = true;
        }

        return res;
    }

    /**
     * todo deplace to store?
     * @param type
     * @param ref
     * @returns {*}
     */
    loadDrop(type, ref) {
        let res;

        switch (type) {
            case 'item':
                res = Item.get(this.game, ref);
                break;
        }

        return res;
    }

    /**
     *
     */
    run() {
        if (this.count == 0) {
            this.timeout().cancel(this.timer);

            // new battle
            this.battle.init();
            this.battle.chooseEnemies();

            // [saving]
            this.game().save();

            // redirection
            this.location().path('/battle');

            return;
        }
        this.timer = this.game().$timeout(() => {
            this.count--;
            this.run();
        }, 1000);
    }

    /**
     *
     * @returns {*}
     */
    save() {
        let res = _.pick(this, 'xp', 'success');

        if (this.drops.length > 0) {
            res.drops = [];
            for (let i in this.drops) {
                res.drops.push(i.save());
            }
        }

        return res;
    }

}