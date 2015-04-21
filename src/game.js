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
        this.version = "2.0.0-alpha.1";

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
        this.team = [];
        this.team.push(Character.get(this, 'cloud'));
        this.team.push(Character.get(this, 'barret'));

        this.backup = [];
        this.backup.push(Character.get(this, 'tifa'));
        this.backup.push(Character.get(this, 'aerith'));
        this.backup.push(Character.get(this, 'redxiii'));
        this.backup.push(Character.get(this, 'yuffie'));
        this.backup.push(Character.get(this, 'caitsith'));
        this.backup.push(Character.get(this, 'vincent'));
        this.backup.push(Character.get(this, 'cid'));
    }

    loadGame(save) {
        this.team = [];
        for (let i of save.team) {
            this.team.push(new Character(this, i));
        }

        this.backup = [];
        for (let i of save.backup) {
            this.backup.push(new Character(this, i));
        }
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
        let w = this.store['weapons'][type][name];
        w.name = name;
        w.type = type;
        return w;
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

    save() {
        localStorage.save = JSON.stringify(this._save());
    }

    _save() {
        let save = {};

        save.team = [];
        for (let i of this.team) {
            save.team.push(i.save());
        }

        save.backup = [];
        for (let i of this.backup) {
            save.backup.push(i.save());
        }

        return save;
    }

}

Game.$inject = ['$rootScope', '$http', '$timeout', '$translate'];

export default Game;