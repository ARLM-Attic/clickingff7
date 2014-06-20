'use strict';

/**
 * App module
 * @type {object}
 */
var app = angular.module('clickingff7', ['ngRoute', 'ngCookies']);

/**
 * Utils Service
 */
app.service('Utils', Utils);

/**
 * Game Service
 */
app.factory('Game', ['$rootScope', '$cookieStore', '$http', '$timeout', function ($rootScope, $cookieStore, $http, $timeout) {
    return new Game($rootScope, $cookieStore, $http, $timeout);
}]);

/**
 * Used to get floor number
 */
app.filter('floor', function () {
    return function (input) {
        return Math.floor(input);
    }
});

/**
 * Used to get ceil number
 */
app.filter('ceil', function () {
    return function (input) {
        return Math.ceil(input);
    }
});

/**
 * Used to round a number
 */
app.filter('round', function () {
    return function (input, decimals) {
        var d = Math.pow(10, decimals);
        return Math.round(input * d) / d;
    }
});

/**
 * Used to clean an associative array
 */
app.filter('clean', function () {
    return function (items) {
        var result = {};
        angular.forEach(items, function (value, key) {
            if (!value.hasOwnProperty('id')) {
                result[key] = value;
            }
        });
        return result;
    };
});

/**
 * Routes logic
 */
app.config(['$routeProvider',
    function ($routeProvider) {

        $routeProvider.
            when('/game', {
                templateUrl: 'partials/game.html',
                controller : GameCtrl
            }).
            when('/map', {
                templateUrl: 'partials/map.html',
                controller : MapCtrl
            }).
            when('/shop', {
                templateUrl: 'partials/shop.html',
                controller : ShopCtrl
            }).
            when('/inventory', {
                templateUrl: 'partials/inventory.html',
                controller : InventoryCtrl
            }).
            when('/save', {
                templateUrl: 'partials/save.html',
                controller : SaveCtrl
            }).
            otherwise({
                redirectTo: '/game'
            });
    }
]);

/**
 * NAV
 */

function NavCtrl($scope, $location, Game) {

    $scope.isActive = function (route) {
        return route === $location.path();
    }

    /**
     * Go to the game
     */
    $scope.game = function () {
        $location.path("/game");
    };

    /**
     * Go to the map
     */
    $scope.map = function () {
        if (Game.mode == "normal") {
            $location.path("/map");
        }
    };

    /**
     * Go to the inventory
     */
    $scope.inventory = function () {
        if (Game.mode == "normal") {
            $location.path("/inventory");
        }
    };

    /**
     * Go to the shop
     */
    $scope.shop = function () {
        if (Game.mode == "normal") {
            $location.path("/shop");
        }
    };

    /**
     * Save the game
     */
    $scope.save = function (ev) {
        if (Game.mode == "normal") {
            $location.path("/save");
        }
    };

}

/**
 * /Game
 */

function GameCtrl($rootScope, $location, $cookieStore, $http, $timeout, Game, Utils) {

    /**
     * Use a equipped item
     * @param ev
     * @param item
     */
    $rootScope.useItem = function (ev, item) {
        item.use();
        Utils.animate(ev, 'SUCCESS!');
    };

    /**
     * Sell an item
     */
    $rootScope.sell = function (ev, thing) {
        var conf = confirm("Are you sure you want to sell " + thing.name + " ?");
        if (!conf) return;

        if (thing instanceof Weapon) {
            if (thing.equipped) {
                Utils.animate(ev, 'FAIL!');
                return;
            }
            for (var i in Game.weapons) {
                if (_.isEqual(Game.weapons[i], thing)) {
                    Game.weapons.splice(i, 1);
                }
            }
        }
        if (thing instanceof Materia) {
            if (thing.character) {
                Utils.animate(ev, 'FAIL!');
                return;
            }
            for (var i in Game.materias) {
                if (_.isEqual(Game.materias[i], thing)) {
                    Game.materias.splice(i, 1);
                }
            }
        }
        if (thing instanceof Item) {
            for (var i in Game.items) {
                if (_.isEqual(Game.items[i], thing)) {
                    Game.items.splice(i, 1);
                }
            }
        }

        Game.gils += thing.getPrice();
        Utils.animate(ev, 'SUCCESS!');
    };

    /**
     * Auto train
     */
    $rootScope.train = function (ev) {
        if (Game.mode == 'normal') {
            Game.characters.train();
            Utils.animate(ev, 'SUCCESS!');
        }
    };

    /**
     * Stop training
     */
    $rootScope.stopTrain = function (ev) {
        if (Game.mode == 'train') {
            Game.characters.stopTrain();
            Utils.animate(ev, 'SUCCESS!');
        }
    };

    /**
     * Explore for fight
     */
    $rootScope.explore = function (ev) {
        if (Game.mode == "normal") {
            Game.battle.start();
            Utils.animate(ev, 'SUCCESS!');
        }
    };

    /**
     * Attack manually enemy
     */
    $rootScope.attack = function (ev) {
        if (Game.characters.canAttack()) {
            // stop autoAttacking
            Game.characters.stopFighting();

            var hits = Game.characters.getHits();
            var d = Math.pow(10, 2);
            hits = Math.round(hits * d) / d;
            // checks limit
            if (Game.characters.canLimit()) {
                hits *= 2;
                Game.characters.limit = 0;
            }
            Game.enemies.getAttacked(hits, false);
            Game.characters.autoFighting();
        }
    };

    /**
     * Escape fight
     */
    $rootScope.escape = function (ev) {
        if (Game.characters.canEscape()) {
            Game.characters.escape();
            Utils.animate(ev, 'SUCCESS!');
        }
    };

    /**
     * Cure maually characters
     */
    $rootScope.restore = function (ev) {
        if (Game.characters.canRestore()) {
            var res = Game.characters.restore();
            Utils.animate(ev, '+' + res);
        }
    };

}

/**
 * /Map
 */

function MapCtrl($rootScope, $location, Game, Utils) {

    /**
     * Checkin'
     */
    if (!Game.loaded) {
        $location.path("/game");
        return;
    }

    /**
     * Go the a zone
     */
    $rootScope.goZone = function (ev, zone) {
        zone.go();
        Utils.animate(ev, 'SUCCESS!');
    };

}

/**
 * /Inventory
 */

function InventoryCtrl($rootScope, $location, Game, Utils) {

    /**
     * Checkin'
     */
    if (!Game.loaded) {
        $location.path("/game");
        return;
    }

    /**
     * Sell an item
     */
    $rootScope.sell = function (ev, thing) {
        var conf = confirm("Are you sure you want to sell " + thing.name + " ?");
        if (!conf) return;

        if (thing instanceof Weapon) {
            if (thing.equipped) {
                Utils.animate(ev, 'FAIL!');
                return;
            }
            for (var i in Game.weapons) {
                if (_.isEqual(Game.weapons[i], thing)) {
                    Game.weapons.splice(i, 1);
                }
            }
        }
        if (thing instanceof Materia) {
            if (thing.character) {
                Utils.animate(ev, 'FAIL!');
                return;
            }
            for (var i in Game.materias) {
                if (_.isEqual(Game.materias[i], thing)) {
                    Game.materias.splice(i, 1);
                }
            }
        }
        if (thing instanceof Item) {
            for (var i in Game.items) {
                if (_.isEqual(Game.items[i], thing)) {
                    Game.items.splice(i, 1);
                }
            }
        }

        Game.gils += thing.getPrice();
        Utils.animate(ev, 'SUCCESS!');
    };

    /**
     * Use an item from the inventory
     */
    $rootScope.useItem = function (ev, item) {
        item.use();
        Utils.animate(ev, 'SUCCESS!');
    };

    /**
     * Equip a weapon from the inventory
     */
    $rootScope.equipWeapon = function (ev, weapon) {
        weapon.equip();
        Utils.animate(ev, 'SUCCESS!');
    };

    /**
     * Equip a materia from the inventory
     */
    $rootScope.equipMateria = function (ev, materia, characterRef) {
        $(ev.target).parent().hide();
        materia.equip(characterRef);
        Utils.animate(ev, 'SUCCESS!');
    };

    /**
     * Equip a materia from the inventory
     */
    $rootScope.showList = function (ev) {
        $(ev.target).prev().show();
    };

    /**
     * Equip a materia from the inventory
     */
    $rootScope.hideList = function (ev) {
        $(ev.target).parent().hide();
    };

    /**
     * Unequip a materia from the inventory
     */
    $rootScope.unequipMateria = function (ev, materia) {
        materia.unequip();
        Utils.animate(ev, 'SUCCESS!');
    };

}

/**
 * /Shop
 */

function ShopCtrl($rootScope, $location, Game, Utils) {

    /**
     * Checkin'
     */
    if (!Game.loaded) {
        $location.path("/game");
        return;
    }

    /**
     * Buy an item from the store
     */
    $rootScope.buy = function (ev, item) {
        if (Game.shop.canBuy(item)) {
            if (item instanceof Weapon) {
                Game.addWeapon(item.ref);
            }
            if (item instanceof Materia) {
                Game.addMateria(item.ref);
            }
            if (item instanceof Item) {
                Game.addItem(item.ref);
            }

            Game.gils = Math.max(Game.gils - item.getPrice(), 0);
            Utils.animate(ev, 'Success!');
        }
    };

}

/**
 * /Save
 */

function SaveCtrl($scope, $rootScope, $location, Game, Utils) {

    /**
     * Checkin'
     */
    if (!Game.loaded) {
        $location.path("/game");
        return;
    }

    /**
     * Save the game
     */
    $rootScope.saveGame = function (ev) {
        Game.save();
        Utils.animate(ev, 'OK!');
    };

    /**
     * Reset the game
     */
    $rootScope.resetGame = function (ev) {
        if (confirm('Are you sure ? You\'ll lose everything !')) {
            Game.reset();
            location.reload();
        }
    };

    /**
     * Export the current save
     */
    $rootScope.exportLastSave = function (ev) {
        $scope.area = Game.last_export;
        Utils.animate(ev, 'OK!');
    };

    /**
     * Export the current game
     */
    $rootScope.exportCurrentGame = function (ev) {
        var save = Game._export();
        $scope.area = JSON.stringify(save);
        Utils.animate(ev, 'OK!');
    };

    /**
     * Import a save
     */
    $rootScope.importSave = function (ev) {
        if (!Game.last_export || confirm('Are you sure ? You\'ll lose your current save !')) {
            var save = JSON.parse($scope.area);
            Game._import(save);
            location.reload();
        }
    };

}