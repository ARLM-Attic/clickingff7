import IndexController from './controllers/index';
import GameController from './controllers/game';

import Game from './game';

import 'angular-route';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import _ from 'lodash';

function config($routeProvider) {
    $routeProvider.
        when('/game', {
            templateUrl: 'partials/game.html',
            controller : 'GameController'
        }).
        when('/map', {
            templateUrl: 'partials/map.html',
            controller : 'MapCtrl'
        }).
        when('/shop', {
            templateUrl: 'partials/shop.html',
            controller : 'ShopCtrl'
        }).
        when('/items', {
            templateUrl: 'partials/items.html',
            controller : 'ItemsCtrl'
        }).
        when('/equip', {
            templateUrl: 'partials/equip.html',
            controller : 'EquipCtrl'
        }).
        when('/materia', {
            templateUrl: 'partials/materia.html',
            controller : 'MateriaCtrl'
        }).
        when('/config', {
            templateUrl: 'partials/config.html',
            controller : 'ConfigCtrl'
        }).
        when('/phs', {
            templateUrl: 'partials/phs.html',
            controller : 'PHSCtrl'
        }).
        when('/save', {
            templateUrl: 'partials/save.html',
            controller : 'SaveCtrl'
        }).
        otherwise({
            redirectTo: '/game'
        });
}

config.$inject = ['$routeProvider'];

var app = angular.module('clickingff7', ['ngRoute', 'pascalprecht.translate'])
    .config(config)
    .filter('time', function () {
        return function (elapsed) {
            var hours = Math.floor(elapsed / 3600);
            elapsed -= hours * 3600;

            var minutes = Math.floor(elapsed / 60);
            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            var seconds = elapsed - minutes * 60;
            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return hours + ':' + minutes + ':' + seconds;
        };
    })
    .controller('IndexController', IndexController)
    .controller('GameController', GameController)
    .service('Game', Game);

export default 'clickingff7';