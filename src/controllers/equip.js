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
         * current section to show
         * @type {null}
         */
        this.type = null;

        /**
         * current (materia) equipment selected to change
         * @type {null}
         */
        this.equipment = null;

        /**
         * current materia hole
         * @type {null}
         */
        this.hole = null;

        /**
         * new equipment/materia/'remove'
         * @type {null}
         */
        this.replacement = null;

        // refresh character stats
        this.refreshStats();

        // refresh equipment/materia list
        this.refreshLists();

    }

    /**
     *
     */
    refreshLists() {

        this.weapon = this.character.weapon;
        this.armor = this.character.armor;
        this.accessory = this.character.accessory;

        let type = this.character.data.weapon.type;
        let id, ids = [];

        id = (this.weapon) ? this.weapon.id : null;
        this.weapons = _.filter(this.game.weapons, (e) => {
            return (e.data.type == type && e.id != id);
        });

        for (let i of this.game.characters) {
            if (i.armor) {
                ids.push(i.armor.id);
            }
        }
        this.armors = _.filter(this.game.armors, (e) => {
            return (ids.indexOf(e.id) == -1);
        });

        for (let i of this.game.characters) {
            if (i.accessory) {
                ids.push(i.accessory.id);
            }
        }
        this.accessories = _.filter(this.game.accessories, (e) => {
            return (ids.indexOf(e.id) == -1);
        });

        ids = this._getUsedMaterias();
        this.materias = _.filter(this.game.materias, (e) => {
            return (ids.indexOf(e.id) == -1);
        });

    }

    /**
     *
     * @returns {Array}
     * @private
     */
    _getUsedMaterias() {
        let res = [], materia;
        for (let i of this.game.characters) {
            if (i.weapon) {
                for (let j of i.weapon.materias) {
                    if (!_.isUndefined(j)) {
                        res.push(j.id);
                    }
                }
            }
            if (i.armor) {
                for (let k of i.armor.materias) {
                    if (!_.isUndefined(k)) {
                        res.push(k.id);
                    }
                }
            }
        }
        return res;
    }

    /**
     *
     * @param character
     */
    selectCharacter(character) {
        this.game.selectedCharacter = character;
        this.reset();
    }


    /**
     *
     * @param type {String}
     */
    toggleChangeEquipment(type) {
        if (this.type != type || this.equipment != this.character[type]) {
            this.type = type;
            this.equipment = this.character[type];
        } else {
            this.reset();
        }
    }

    /**
     *
     * @param eq
     * @param hole
     */
    toggleChangeMateria(eq, hole) {
        if (this.type != 'materia' || this.equipment != eq || this.hole != hole) {
            this.type = 'materia';
            this.equipment = eq;
            this.hole = hole;
        } else {
            this.reset();
        }
    }

    /**
     *
     * @param e {Equipment|null}
     */
    togglePreviewEquipment(e) {
        let stats;
        if (!_.isNull(this.replacement) && this.replacement == e) {
            this.replacement = null;

        } else {
            this.replacement = e;
            stats = (!_.isUndefined(e)) ? e.data.stats : {};
        }
        this.refreshStats(stats);
    }

    /**
     *
     * @param e {Materia|null}
     */
    togglePreviewMateria(e) {
        this.replacement = (!_.isNull(this.replacement) && this.replacement == e) ? null : e;
    }

    /**
     *
     * @returns {boolean}
     */
    isEquipment() {
        return !_.isUndefined(this.equipment);
    }

    /**
     *
     * @returns {boolean}
     */
    isMateria() {
        return !_.isUndefined(this.equipment.materias[this.hole]);
    }

    /**
     *
     * @returns {boolean}
     */
    isSelection() {
        return !_.isNull(this.replacement);
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
     * @param equipment
     */
    changeEquipment(newE) {
        let materias = [];

        // remove current equipment if any
        if (!_.isUndefined(this.equipment)) {
            materias = this.equipment.removeAllMateria();
            this.character.unequip(this.type);
        }

        // equip replacement if any
        if (!_.isUndefined(this.replacement)) {
            this.replacement.loadMaterias(materias);
            this.character.equip(this.replacement);
        }

        // refresh stats
        this.refreshStats();

        // reset
        this.reset();

        // reload lists
        this.refreshLists();

        // [saving]
        this.game.save();

    }

    /**
     *
     */
    changeMateria() {
        // remove curr materia if any
        this.equipment.materias[this.hole] = undefined;

        // equip replacement if any
        if (!_.isUndefined(this.replacement)) {
            this.equipment.materias[this.hole] = this.replacement;
        }

        // reset
        this.reset();

        // reload lists
        this.refreshLists();

        // [saving]
        this.game.save();
    }

}

EquipController.$inject = ['Game', '$location', '$routeParams'];

export default EquipController;