import Controller from 'commons/controller';
import _ from 'lodash';

class EquipController extends Controller {

    constructor(game, $location, $routeParams) {
        super(game, $location);

        this.VIEW_PROFILE = 'view-profile';
        this.VIEW_TEAM = 'view-team';
        this.VIEW_RELICS = 'view-relics';
        this.VIEW_MATERIAS = 'view-materias';

        this.reset();


    }

    /**
     *
     */
    reset() {

        /**
         *  Current selected character
         */
        this.character = this.game.selectedCharacter;

        /**
         * available relics
         * @type {boolean}
         */
        this.listRelics = [];

        /**
         * available materias
         */
        this.listMaterias = [];

        /**
         *
         * @type {string}
         */
        this.mode = this.VIEW_PROFILE;

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
     */
    getRelics() {

        let ids = [];

        // gather other characters relics
        for (let i of this.game.characters) {
            if (i.relic) {
                ids.push(i.relic.id);
            }
        }

        // build list
        this.listRelics = _.filter(this.game.relics, (e) => {
            return (ids.indexOf(e.id) == -1);
        });

        this.mode = this.VIEW_RELICS;

    }

    /**
     *
     */
    getMaterias(m) {

        // on mémorise celle qu'on veut enlever
        this.selectedMateria = undefined;
        if (!_.isUndefined(m)) {
            this.selectedMateria = m;
        }

        let ids = [];

        // gather other characters relics
        for (let i of this.game.characters) {
            if (i.relic && i.relic.materias) {
                ids = _.union(ids, _.map(i.relic.materias, 'id'));
            }
        }

        // build list
        this.listMaterias = _.filter(this.game.materias, (e) => {
            return (ids.indexOf(e.id) == -1);
        });

        this.mode = this.VIEW_MATERIAS;

    }

    /**
     *
     * @param replacement
     */
    changeRelic(replacement) {
        //let materias = [];

        // remove current equipment if any
        if (!_.isUndefined(this.character.relic)) {
            // materias = this.equipment.removeAllMateria();
            this.character.unequip();
        }

        // equip replacement if any
        if (!_.isUndefined(replacement)) {
            //replacement.loadMaterias(materias);
            this.character.equip(replacement);
        }

        // [saving]
        this.game.save();

        this.mode = this.VIEW_PROFILE;

    }

    /**
     *
     * @param replacement
     */
    changeMateria(replacement) {
        //let materias = [];

        // remove current mateia if any
        if (!_.isUndefined(this.selectedMateria)) {
            this.character.relic.unequip(this.selectedMateria);
        }

        // equip replacement if any
        if (!_.isUndefined(replacement)) {
            this.character.relic.equip(replacement);
        }

        // [saving]
        this.game.save();

        this.mode = this.VIEW_PROFILE;

    }

}

EquipController.$inject = ['Game', '$location', '$routeParams'];

export default EquipController;