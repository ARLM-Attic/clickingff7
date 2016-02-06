import IndexController from './controllers/index';
import HomeController from './controllers/home';
import PhsController from './controllers/phs';
import StoryController from './controllers/story';
import BattleController from './controllers/battle';
import RewardsController from './controllers/rewards';
import LostController from './controllers/lost';
import EquipController from './controllers/equip';
import MateriaController from './controllers/materia';
import PlayController from './controllers/play';
import TalkController from './controllers/talk';
import Route from './route';

import Game from './game';

import 'angular-route';
import 'angular-translate';
import 'angular-translate-loader-static-files';

function config($routeProvider, $translateProvider) {

    $translateProvider.useStaticFilesLoader({
        files: [{
            prefix: 'languages/main-',
            suffix: '.json'
        },{
            prefix: 'languages/scenes-',
            suffix: '.json'
        }]
    });

    $translateProvider.determinePreferredLanguage();

    $routeProvider.
        when('/play', Route.get('play')).
        when('/home', Route.get('home')).
        when('/story', Route.get('story')).
        when('/battle', Route.get('battle')).
        when('/rewards', Route.get('rewards')).
        when('/lost', Route.get('lost')).
        when('/equip', Route.get('equip')).
        when('/materia', Route.get('materia')).
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
    .controller('StoryController', StoryController)
    .controller('BattleController', BattleController)
    .controller('RewardsController', RewardsController)
    .controller('LostController', LostController)
    .controller('EquipController', EquipController)
    .controller('MateriaController', MateriaController)
    .controller('PlayController', PlayController)
    .controller('TalkController', TalkController)
    .service('Game', Game);

export default 'clickingff7';