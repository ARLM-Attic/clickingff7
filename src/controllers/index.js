class IndexController {

    constructor(game, $location) {
        this.game = game;
        this.$location = $location;
    }

    gameFn() {
        return this.game.mode;
    }

    isActive(route) {
        return route === this.$location.path();
    }

    isChannel(host) {
        return this.$location.host() === host;
    }

    /**
     * Go to the game
     */
    goGame() {
        this.$location.path("/game");
    }

    /**
     * Go to the story
     */
    goStory() {
        if (this.game.mode !== 'battle') {
            this.$location.path("/story");
        }
    }

    /**
     * Go to the PHS
     */
    goPHS(ev) {
        if (this.game.mode !== 'battle') {
            this.$location.path("/phs");
        }
    }

}

IndexController.$inject = ['Game', '$location'];

export default IndexController;