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

    initEquipment() {
        let type = this.character.data.weapon.type;
        this.weapons = _.where(this.game.weapons, function (e) {
            return e.data.type == type;
        });
        this.armor = this.game.armors;
        this.accessories = this.game.accessories;
    }

    toggleWeapon(weapon) {
        this.selected = (this.selected != weapon) ? weapon : null;
    }

}

EquipController.$inject = ['Game', '$location', '$routeParams'];

export default EquipController;