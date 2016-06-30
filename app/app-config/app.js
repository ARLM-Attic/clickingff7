import IndexController from 'commons/index.controller';
import HomeController from 'home/home.controller';
import PhsController from 'phs/phs.controller';
import BattleController from 'battle/battle.controller';
import EquipController from 'equip/equip.controller';
import PlayController from 'play/play.controller';
import TalkController from 'talk/talk.controller';
import Route from 'commons/route';

import Game from 'commons/game';

import 'angular-route';
import 'angular-translate';
import 'angular-translate-loader-static-files';

function config($routeProvider, $translateProvider) {

    $translateProvider.useStaticFilesLoader({
        files: [{
            prefix: 'i18n/main-',
            suffix: '.json'
        },{
            prefix: 'i18n/scenes-',
            suffix: '.json'
        }]
    });

    $translateProvider.determinePreferredLanguage();

    $routeProvider.
        when('/play', Route.get('play')).
        when('/home', Route.get('home')).
        when('/battle', Route.get('battle')).
        when('/rewards', Route.get('rewards')).
        when('/lost', Route.get('lost')).
        when('/equip', Route.get('equip')).
        when('/phs', Route.get('phs')).
        when('/talk', Route.get('talk')).
        otherwise({
            redirectTo: '/home'
        });
}

config.$inject = ['$routeProvider', '$translateProvider'];

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
    .controller('HomeController', HomeController)
    .controller('PhsController', PhsController)
    .controller('BattleController', BattleController)
    .controller('EquipController', EquipController)
    .controller('PlayController', PlayController)
    .controller('TalkController', TalkController)
    .service('Game', Game);

export default 'clickingff7';