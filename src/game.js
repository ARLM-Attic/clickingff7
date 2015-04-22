import Character from './character';
import Story from './story';
import Store from './store';

class Game {

    constructor($rootScope, $http, $timeout, $translate) {

        // angular vars
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.$timeout = $timeout;
        this.$translate = $translate;

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

        this.team = [];
        this.backup = [];
        this.stories = [];

        // general data has been loaded
        this.loaded = false;

        // Do the magic :-)
        this.preload();
    }

    /**
     * Build store from json files (path : /data)
     */
    preload() {
        let files = ['characters', 'weapons', 'stories'];

        this._preload(files);
    }

    /**
     * Recursive loading
     * @todo display progression
     * @param files
     * @private
     */
    _preload(files) {
        let file = files[0];

        this.$http.get(`/data/${file}.json`)
            .success((data) => {
                this.store[file] = data;

                files.shift();

                if (files.length > 0) {
                    this._preload(files);
                } else {
                    this.loaded = true;
                    this.run();
                }
            })
            .error(() => {
                // todo handle error
            });
    }

    /**
     * Run the game, after preloading
     */
    run() {
        // load save
        if (localStorage.save) {
            let save = JSON.parse(localStorage.save)
            this.loadGame(save);
        } else {
            this.newGame();
        }
    }

    /*
     * NEW GAME
     */
    newGame(level) {
        // add all characters
        // note : cloud & barret are in the team
        this.addCharacter('team', 'cloud');
        this.addCharacter('team', 'barret');

        this.addCharacter('backup', 'tifa');
        this.addCharacter('backup', 'aerith');
        this.addCharacter('backup', 'redxiii');
        this.addCharacter('backup', 'yuffie');
        this.addCharacter('backup', 'caitsith');
        this.addCharacter('backup', 'vincent');
        this.addCharacter('backup', 'cid');

        this.addStory(1);
    }

    /**
     * LOAD GAME
     * @param save
     */
    loadGame(save) {
        try {
            for (let i of save.team) {
                this.team.push(new Character(this, i));
            }

            for (let i of save.backup) {
                this.backup.push(new Character(this, i));
            }

            for (let i of save.stories) {
                this.stories.push(new Story(this, i));
            }
        } catch (err) {
            throw new Error('[Save not valid] ' + err);
        }
    }

    /**
     * Add a character
     * @param position
     * @param name
     */
    addCharacter(position, name) {
        this[position].push(Character.get(this, name));
    }

    /**
     * Add a story
     * @param nbr
     */
    addStory(nbr) {
        this.stories.push(Story.get(this, nbr));
    }

    /**
     * Let the character join the team
     * @param character
     */
    joinTeam(character) {
        _.remove(this.backup, character);
        this.team.push(character);
    }

    /**
     * Let the character leave the team
     * @param character
     */
    leaveTeam(character) {
        _.remove(this.team, character);
        this.backup.push(character);
    }

    /**
     * SAVE GAME
     */
    save() {
        let save = {};

        save.team = [];
        for (let i of this.team) {
            save.team.push(i.save());
        }

        save.backup = [];
        for (let i of this.backup) {
            save.backup.push(i.save());
        }

        save.stories = [];
        for (let i of this.stories) {
            save.stories.push(i.save());
        }

        localStorage.save = JSON.stringify(save);
    }

}

Game.$inject = ['$rootScope', '$http', '$timeout', '$translate'];

export default Game;