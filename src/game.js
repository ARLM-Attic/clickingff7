import Character from './character';
import Story from './story';
import Store from './store';
import Battle from './battle';
import Weapon from './equipment/weapon';
import Armor from './equipment/armor';
import Accessory from './equipment/accessory';
import Materia from './materia';
import _ from 'lodash';

class Game {

    constructor($rootScope, $http, $timeout, $translate, $location) {

        // angular vars
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.$timeout = $timeout;
        this.$translate = $translate;
        this.$location = $location;

        // binding
        this.$rootScope.game = this;

        // one mode per time
        this.mode = 'free';

        // timer
        this.timer = null;

        // gils
        this.gils = 200;

        // language
        this.language = 'en';

        // current time
        this.time = 0;

        // current version
        this.version = "2.0.0-alpha.1";

        // general data (characters, weapons, ..)
        this.store = new Store();

        this.characters = [];
        this.team = [];
        this.backup = [];
        this.stories = [];
        this.story = null; // current story
        this.battle = null; // current battle
        this.weapons = [];
        this.armors = [];
        this.accessories = [];
        this.materias = [];

        // general data has been loaded
        this.loaded = false;

        // Do the magic :-)
        //this.preload();
        this.files = ['characters', 'weapons', 'armors', 'accessories', 'materias', 'stories', 'enemies'];
    }

    /**
     * Recursive loading
     * @todo display progression
     * @param q
     */
    preload(q) {
        let file = this.files[0];

        this.$http.get(`/data/${file}.json`)
            .success((data) => {
                this.store[file] = data;

                this.files.shift();

                if (this.files.length > 0) {
                    this.preload(q);
                } else {
                    this.loaded = true;
                    this.run(q);
                }
            })
            .error(() => {
                // todo handle error
            });
    }

    /**
     * Run the game, after preloading
     */
    run(q) {
        // load save
        if (localStorage.save) {
            let save = JSON.parse(localStorage.save);
            this.loadGame(save);
        } else {
            this.newGame();
        }

        // set selected character
        this.selectedCharacter = this.team[0];

        q.resolve();
    }

    /*
     * NEW GAME
     */
    newGame() {
        // add all characters
        // note : cloud & barret are in the team
        this.addCharacter(Character.get(this, 'cloud'), true);
        this.addCharacter(Character.get(this, 'barret'), true);

        this.addCharacter(Character.get(this, 'tifa'));
        this.addCharacter(Character.get(this, 'aerith'));
        this.addCharacter(Character.get(this, 'redxiii'));
        this.addCharacter(Character.get(this, 'yuffie'));
        this.addCharacter(Character.get(this, 'caitsith'));
        this.addCharacter(Character.get(this, 'vincent'));
        this.addCharacter(Character.get(this, 'cid'));

        this.buildTeam();

        this.addWeapon(Weapon.get(this, 'assaultGun'));
        this.addArmor(Armor.get(this, 'bronzeBangle'));
        this.addAccessory(Accessory.get(this, 'talisman'));
        this.addMateria(Materia.get(this, 'bolt'));
        this.addMateria(Materia.get(this, 'bolt'));
        this.addMateria(Materia.get(this, 'fire'));

        this.addStory(1, true);
    }

    /**
     * LOAD GAME
     * @param save
     */
    loadGame(save) {
        try {

            for (let i of save.weapons) {
                this.weapons.push(new Weapon(this, i));
            }

            for (let i of save.armors) {
                this.armors.push(new Armor(this, i));
            }

            for (let i of save.accessories) {
                this.accessories.push(new Accessory(this, i));
            }

            for (let i of save.materias) {
                this.materias.push(new Materia(this, i));
            }

            // team & backup
            // need weapons/armors/accessories/materias

            for (let i of save.characters) {
                this.characters.push(new Character(this, i));
            }

            this.buildTeam();

            for (let i of save.stories) {
                let story = new Story(this, i);
                this.stories.push(story);

                // select current story
                if (save.story && save.story.ref == story.ref) {
                    this.story = story;
                }
            }

            if (save.battle) {
                this.battle = new Battle(this, save.battle);
                if (save.battle.rewards) {
                    this.$location.path('/rewards');
                } else {
                    this.$location.path('/battle');
                }
            }

        } catch (err) {
            throw new Error('[Save not valid] ' + err);
        }
    }

    /**
     * Add a character
     * @param character
     * @param active
     */
    addCharacter(character, active=false) {
        character.active = active;
        this.characters.push(character);
    }

    /**
     *
     */
    buildTeam() {
        this.team = _.where(this.characters, {active: true});
        this.backup = _.where(this.characters, {active: false});
    }

    /**
     *
     * @param weapon
     */
    addWeapon(weapon) {
        this.weapons.push(weapon);
    }

    /**
     *
     * @param armor
     */
    addArmor(armor) {
        this.armors.push(armor);
    }

    /**
     *
     * @param accessory
     */
    addAccessory(accessory) {
        this.accessories.push(accessory);
    }

    /**
     * Add a materia
     * @param materia
     */
    addMateria(materia) {
        this.materias.push(materia);
    }

    /**
     * Add a story
     * @param ref
     * @param selected
     */
    addStory(ref, selected) {
        let story = Story.get(this, ref);
        this.stories.push(story);
        if (selected) {
            this.story = story;
        }
    }

    /**
     * SAVE GAME
     */
    save() {
        let save = {};

        save.characters = [];
        for (let i of this.characters) {
            save.characters.push(i.save());
        }

        save.stories = [];
        for (let i of this.stories) {
            save.stories.push(i.save());
        }

        if (this.story) {
            save.story = this.story.save();
        }

        if (this.battle) {
            save.battle = this.battle.save();
        }

        save.weapons = [];
        for (let i of this.weapons) {
            save.weapons.push(i.save());
        }

        save.armors = [];
        for (let i of this.armors) {
            save.armors.push(i.save());
        }

        save.accessories = [];
        for (let i of this.accessories) {
            save.accessories.push(i.save());
        }

        save.materias = [];
        for (let i of this.materias) {
            save.materias.push(i.save());
        }

        localStorage.save = JSON.stringify(save);
    }

}

Game.$inject = ['$rootScope', '$http', '$timeout', '$translate', '$location'];

export default Game;