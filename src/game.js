import Character from './character';

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
        this.version = "1.1.2";

        // general data (characters, weapons, ..)
        this.store = {};

        // general data has been loaded
        this.loaded = false;

        // Do the magic :-)
        this.preload();
    }

    /**
     * Build store from json files (path : /data)
     */
    preload() {
        let files = ['characters', 'weapons'];

        this._preload(files);
    }

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
        // search for save
        var save = localStorage.save;

        // load save
        if (save) {
            this.load(save);
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
        this.team = [];
        this.team.push(new Character(this, this.getCharacterFromData('cloud')));
        this.team.push(new Character(this, this.getCharacterFromData('barret')));

        this.backup = [];
        this.backup.push(new Character(this, this.getCharacterFromData('tifa')));
        this.backup.push(new Character(this, this.getCharacterFromData('aerith')));
        this.backup.push(new Character(this, this.getCharacterFromData('redxiii')));
        this.backup.push(new Character(this, this.getCharacterFromData('yuffie')));
        this.backup.push(new Character(this, this.getCharacterFromData('caitsith')));
        this.backup.push(new Character(this, this.getCharacterFromData('vincent')));
        this.backup.push(new Character(this, this.getCharacterFromData('cid')));
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    getCharacterFromData(name) {
        return _.find(this.store['characters'], {name: name});
    }

    /**
     *
     * @param type
     * @param name
     * @returns {*}
     */
    getWeaponFromData(type, name) {
        return this.store['weapons'][type][name];
    }

    /**
     * Return active characters (in team)
     */
    getTeam() {
        return _.where(this.characters, {inTeam: true});
    }

    joinTeam(character) {
        _.remove(this.backup, character);
        this.team.push(character);
    }

    leaveTeam(character) {
        _.remove(this.team, character);
        this.backup.push(character);
    }

}

Game.$inject = ['$rootScope', '$http', '$timeout', '$translate'];

export default Game;