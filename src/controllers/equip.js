import Controller from '../controller';
import _ from 'lodash';

class EquipController extends Controller {

    constructor(game, $location, $routeParams) {
        super(game, $location);

        this.reset();

    }

    /**
     *
     */
    reset() {

        /**
         * shortcut to global selected character
         * @type {*|i}
         */
        this.character = this.game.selectedCharacter;

        /**
         * current equipment type
         * @type {null}
         */
        this.type = null;

        /**
         * current equipment selected to change
         * @type {null}
         */
        this.equipment = null;

        /**
         * show the avalaible equipment
         * @type {boolean}
         */
        this.showList = false;

        /**
         * refresh character stats
         *
         * manually called after equip/unequip
         */
        this.refreshStats();

    }

    /**
     *
     * @param type
     */
    refreshList(type) {

        let store = {
            'weapon'   : 'weapons',
            'armor'    : 'armors',
            'accessory': 'accessories'
        };

        let wtype = this.character.data.weapon.type;
        let id, ids = [];

        if (type == 'weapon') {

            id = (this.equipment) ? this.equipment.id : null;

        } else {

            for (let i of this.game.characters) {
                if (i[type]) {
                    ids.push(i[type].id);
                }
            }

        }

        // build list
        this.list = _.filter(this.game[store[type]], (e) => {
            return ((type == 'weapon' && e.data.type == wtype && e.id != id)
            || (type != 'weapon' && ids.indexOf(e.id) == -1));
        });

    }

    /**
     *
     * @param c
     */
    changeCharacter(c) {
        this.game.selectedCharacter = c;
        this.reset();
    }


    /**
     *
     * @param type {String}
     */
    show(type) {
        this.type = type;
        this.equipment = this.character[type];
        this.showList = true;
        this.refreshList(type);
    }

    /**
     * Remove current equipment type
     */
    remove() {
        this.character.unequip(this.type);
        this.equipment = null;

        // refresh stats
        this.refreshStats();

        // reload lists
        this.refreshList(this.type);

        // [saving]
        this.game.save();
    }

    /**
     *
     * @param s
     */
    refreshStats(s) {
        this.final = {};
        let stats = ['hpMax', 'mpMax', 'str', 'def', 'mgi', 'res', 'dex', 'lck'];
        for (let i of stats) {

            // base character stat
            let curr = this.character[i], final = curr;

            if (s) {

                // if the character has a weapon and the stat
                if (this.equipment && this.equipment.data.stats[i]) {
                    final -= this.equipment.data.stats[i];
                }

                // add the selected stat
                if (s[i]) {
                    final += s[i];
                }

            }

            this.final[i] = {};

            this.final[i].value = final;

            this.final[i].change = '';
            if (final > curr)
                this.final[i].change = 'stat-up';
            if (final < curr)
                this.final[i].change = 'stat-down';

        }
    }

    /**
     *
     * @param stat
     * @param key
     * @returns {*}
     */
    stat(stat, key = 'value') {
        return this.final[stat][key];
    }

    /**
     *
     * @param replacement
     */
    change(replacement) {
        //let materias = [];

        // remove current equipment if any
        if (!_.isUndefined(this.equipment)) {
            // materias = this.equipment.removeAllMateria();
            this.character.unequip(this.type);
        }

        // equip replacement
        //replacement.loadMaterias(materias);
        this.character.equip(replacement);
        this.equipment = replacement;

        // refresh stats
        this.refreshStats();

        // reload lists
        this.refreshList(this.type);

        // [saving]
        this.game.save();

    }

}

EquipController.$inject = ['Game', '$location', '$routeParams'];

export default EquipController;