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
        let files = ['characters'];

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
        this.characters = [];
        this.characters.push(new Character(this, this.getFromStore('characters', 'cloud'), true));
        this.characters.push(new Character(this, this.getFromStore('characters', 'barret'), true));
        this.characters.push(new Character(this, this.getFromStore('characters', 'tifa')));
        this.characters.push(new Character(this, this.getFromStore('characters', 'aerith')));
        this.characters.push(new Character(this, this.getFromStore('characters', 'redxiii')));
        this.characters.push(new Character(this, this.getFromStore('characters', 'yuffie')));
        this.characters.push(new Character(this, this.getFromStore('characters', 'caitsith')));
        this.characters.push(new Character(this, this.getFromStore('characters', 'vincent')));
        this.characters.push(new Character(this, this.getFromStore('characters', 'cid')));

        //this.weapons.push(new Weapon(this, 'BusterSword'));

        //this.materias.push(new Materia(this, 'Bolt', true));
        //this.materias.push(new Materia(this, 'Ice', true));

    }

    /**
     * Return store data
     * @param type
     * @param ref
     * @returns {*}
     */
    getFromStore(type, ref) {
        return this.store[type][ref];
    }

    /**
     * Return active characters (in team)
     */
    getTeam() {
        return _.where(this.characters, {inTeam: true});
    }

}

Game.$inject = ['$rootScope', '$http', '$timeout', '$translate'];

export default Game;