export default class Route {

    static get(section) {
        return {
            templateUrl: 'partials/' + section + '.html',
            controller : section.charAt(0).toUpperCase() + section.slice(1) + 'Controller as g',
            resolve    : {
                SomeData: function ($q, Game) {
                    if (!Game.loaded) {
                        var defer = $q.defer();
                        Game.preload(defer);
                        return defer.promise;
                    }
                }
            }
        };
    }

}