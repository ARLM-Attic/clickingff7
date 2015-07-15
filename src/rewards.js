import Item from './item';
import Weapon from './equipment/weapon';
import _ from 'lodash';

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
        let res = [];

        for (let i of this.battle.enemies) {
            let drop = i.data.drop;

            // next enemy if no drops
            if (!drop) continue;

            let rng = _.random(100);
            if (rng <= drop.rate) {
                res.push(this.loadDrop(drop.type, drop.ref));
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
                res = Item.get(this.game(), ref);
                break;
            case 'weapon':
                res = Weapon.get(this.game(), ref);
                break;
        }

        return res;
    }

    /**
     * duration: 1s
     */
    start() {
        if (this.success) {
            this.timer = this.game().$timeout(() => {
                let team = this.game().team;
                let xp = Math.floor(this.xp / team.length); //65
                this.animXp(xp);
                this.giveDrops();
            }, 2000);
        } else {
            // todo handle fail
        }
    }

    /**
     * todo handle drops
     */
    giveDrops() {
        // gain drops
        for (let i of this.drops) {
            this.game().addWeapon(i);
        }
    }

    /**
     * duration: 3s
     */
    animXp(totalXp, sumXp = 0) {
        this.timer = this.game().$timeout(() => {
            for (let i of this.game().team) {
                let totalSeq = 3000;
                let partSeq = 300;
                let xp = Math.ceil(totalXp / (totalSeq / partSeq));
                if (sumXp + xp > totalXp) {
                    xp = totalXp - sumXp;
                }
                sumXp += xp;
                i.setXp(xp);
            }
            if (sumXp < totalXp) {
                this.animXp(totalXp, sumXp);
            } else {
                this.run();
            }
        }, 300);
    }

    /**
     * duration: 1s
     */
    run() {
        this.timer = this.game().$timeout(() => {
            // new battle
            this.battle.init();
            this.battle.chooseEnemies();

            // [saving]
            this.game().save();

            // redirection
            this.location().path('/battle');
        }, 2000);
    }

    /**
     *
     * @returns {*}
     */
    save() {
        let res = _.pick(this, 'xp', 'success');

        if (this.drops.length > 0) {
            res.drops = [];
            for (let i of this.drops) {
                res.drops.push(i.save());
            }
        }

        return res;
    }

}