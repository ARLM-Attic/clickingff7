import Character from './character';
import Story from './story';
import Store from './store';
import Battle from './battle';

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

        this.team = [];
        this.backup = [];
        this.stories = [];
        this.story = null; // current story
        this.battle = null; // current battle

        // general data has been loaded
        this.loaded = false;

        // Do the magic :-)
        //this.preload();
        this.files = ['characters', 'weapons', 'stories', 'enemies'];
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
        q.resolve();
    }

    /*
     * NEW GAME
     */
    newGame() {
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

        this.addStory(1, true);
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
                let story = new Story(this, i);
                this.stories.push(story);

                // select current story
                if (save.story && save.story.ref == story.ref) {
                    this.story = story;
                }
            }

            if (save.battle) {
                this.battle = new Battle(this, save.battle);
                this.$location.path('/battle');
            }

        } catch (err) {
            throw new Error('[Save not valid] ' + err);
        }
    }

    /**
     * Add a character
     * @param position (backup|team)
     * @param name
     */
    addCharacter(position, name) {
        this[position].push(Character.get(this, name));
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

        if (this.story) {
            save.story = this.story.save();
        }

        if (this.battle) {
            save.battle = this.battle.save();
        }

        localStorage.save = JSON.stringify(save);
    }

}

Game.$inject = ['$rootScope', '$http', '$timeout', '$translate', '$location'];

export default Game;