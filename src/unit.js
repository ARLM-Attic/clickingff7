import ActionAttack from './actions/attack';

export default class Unit {

    constructor(game, data) {
        // game reference
        this.game = game;

        // battle initiative
        this.cts = 0;

        // load unit data
        if (data) {
            this.load(data);
        }
    }

    /**
     * Recover HP & MP
     */
    recover() {
        this.hp = this.hpMax;
        this.mp = this.mpMax;
    }

    /**
     *
     * @param battle
     */
    setBattle(battle) {
        this.battle = battle;
    }
    
    /**
     * RUN while still alive
     */
    run() {
        
        this.timer = this.game.$timeout(() => {
        
            // limit depending on dex stat
            let ctsMax = 4500 - this.dex / 150;
            
            this.cts += 100;
            
            if (this.cts >= ctsMax) {
            
                let action = new ActionAttack(this);
                
                this.battle.addAction(action);
                
                this.cts = 0;
            
            }            
            
            // recursive
            this.run();
            
        }, 100);
    }
    
    /**
     * ATB stop if character die
     */
    stop() {
        this.game.$timeout.cancel(this.timer);
    }

    /**
     *
     * @param damage
     */
    getDamaged(damage) {
        this.hp -= damage.hits;
        if (this.hp <= 0) {
            this.hp = 0;
        }
    }

    /**
     * Get Tick Speed
     * @returns {number}
     */
    getTS() {
        let x = 0;
        let fx = 0;
        while (fx < this.dex) {
            x++;
            fx += 2 * (x + 1);
        }
        return (28 - Math.floor(x / 2));
    }

    /**
     *
     * @param battle
     * @param fn
     */
    ai(battle, fn) {
        if (fn) fn();
    }

    /**
     *
     * @param stat
     * @returns {number}
     */
    progress(stat) {
        return Math.floor(this[stat] * 100 / this[stat + 'Max']);
    }

}