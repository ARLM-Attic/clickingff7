import Controller from '../controller';
import _ from 'lodash';

class MateriaController extends Controller {

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
         * current hole to equip materia
         * @type {null}
         */
        this.hole = null;

        /**
         * current equipment selected to change
         * @type {null}
         */
        this.materia = null;

        /**
         * show the avalaible equipment
         * @type {boolean}
         */
        this.showList = false;

    }

    /**
     *
     */
    refreshList() {

        let ids = [];

        for (let i of this.game.characters) {
            let materias = [];
            if (i.weapon) materias = _.union(materias, i.weapon.materias);
            if (i.armor) materias = _.union(materias, i.armor.materias);
            for (let j of materias) {
                if (j) {
                    ids.push(j.id);
                }
            }
        }

        // build list
        this.list = _.filter(this.game.materias, (e) => {
            return (ids.indexOf(e.id) == -1);
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
     * @param type
     * @param hole
     */
    show(type, hole) {
        this.type = type;
        this.equipment = this.character[type];
        this.hole = hole;
        this.materia = this.equipment.materias[this.hole];
        this.showList = true;
        this.refreshList();
    }

    /**
     * Remove current equipment type
     */
    remove() {

        this.equipment.materias[this.hole] = null;
        this.materia = null;

        // refresh character actions
        this.character.refreshActions();

        // reload lists
        this.refreshList();

        // [saving]
        this.game.save();
    }

    /**
     *
     * @param replacement
     */
    change(replacement) {

        this.equipment.materias[this.hole] = replacement;
        this.materia = replacement;

        // refresh character actions
        this.character.refreshActions();

        // reload lists
        this.refreshList();

        // [saving]
        this.game.save();

    }

}

MateriaController.$inject = ['Game', '$location', '$routeParams'];

export default MateriaController;