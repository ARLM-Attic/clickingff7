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
     * Go to the map
     */
    goMap() {
        if (!this.game.battle.isBattle) {
            this.$location.path("/map");
        }
    }

    /**
     * Go to the shop
     */
    goShop() {
        if (!this.game.battle.isBattle) {
            this.$location.path("/shop");
        }
    }

    /**
     * Go to the items
     */
    goItems() {
        if (!this.game.battle.isBattle) {
            this.$location.path("/items");
        }
    }

    /**
     * Go to the weapons
     */
    goEquip() {
        if (!this.game.battle.isBattle) {
            $location.path("/equip");
        }
    }

    /**
     * Go to the materias
     */
    goMateria() {
        if (!this.game.battle.isBattle) {
            this.$location.path("/materia");
        }
    }

    /**
     * Go to the game configuration
     */
    goConfig(ev) {
        if (!this.game.battle.isBattle) {
            this.$location.path("/config");
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

    /**
     * Save the game
     */
    goSave(ev) {
        if (!this.game.battle.isBattle) {
            this.$location.path("/save");
        }
    }

    // Show help
    help(ev) {
        if (!this.game.battle.isBattle) {
            this.$location.path("/game");

            $http({method: 'GET', url: 'help/' + Game.language + '.json'}).
                success(function (data, status, headers, config) {
                    var intro = introJs();
                    intro.setOptions(data);
                    intro.start();
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
    }

}

IndexController.$inject = ['Game', '$location'];

export default IndexController;