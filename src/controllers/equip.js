import Controller from '../controller';

class EquipController extends Controller {

    constructor(game, $location, $routeParams) {
        this.$routeParams = $routeParams;
        super(game, $location);
    }

    /**
     *
     */
    init() {
        this.ref = this.$routeParams.character;
        let characters = _.union(this.game.team, this.game.backup);
        for (let i of characters) {
            if (i.ref == this.ref) {
                this.character = i;
                this.game.selectedCharacter = i;
                break;
            }
        }

        this.equip = 'weapon';
        this.initEquipment();
    }

    /**
     *
     */
    initEquipment() {
        let type = this.character.data.weapon.type;
        this.weapons = _.where(this.game.weapons, function (e) {
            return e.data.type == type;
        });
        this.armor = this.game.armors;
        this.accessories = this.game.accessories;
    }

    /**
     *
     * @param newWeapon
     */
    toggleSelect(newWeapon) {

        if (this.selected != newWeapon) {
            this.selected = newWeapon;
            this.compareStats();
        } else {
            this.selected = null;
            this.final = {};
        }

    }

    /**
     *
     */
    compareStats() {
        // compare stats
        this.final = {};
        for (let i in this.selected.data.stats) {

            // base character stat
            let curr = this.character[i];

            let final = curr;

            // if the character has a weapon and the stat
            let currWeapon = this.character.weapon;
            if (currWeapon && currWeapon.data.stats[i]) {
                final -= currWeapon.data.stats[i];
            }

            // add the selected stat
            final += this.selected.data.stats[i];

            // curr, chande, color
            this.final[i] = {
                curr  : curr,
                change: final,
                color : (final > curr) ? 'green' : 'red'
            };
        }
    }

    /**
     *
     * @param stat
     * @returns {boolean}
     */
    isChanged(stat) {
        if (this.final) {
            let s = this.final[stat];
            return s ? (s.curr != s.change) : false;
        }
        return false;
    }

    /**
     *
     * @param stat
     * @param key
     * @returns {*}
     */
    getFinal(stat, key = 'change') {
        if (this.final) {
            let s = this.final[stat];
            return s ? s[key] : '';
        }
        return null;
    }

}

EquipController.$inject = ['Game', '$location', '$routeParams'];

export default EquipController;