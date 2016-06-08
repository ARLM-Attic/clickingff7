export default class Route {

    static get(section) {
        return {
            templateUrl: section + '/' + section + '.view.html',
            controller : section.charAt(0).toUpperCase() + section.slice(1) + 'Controller as g',
            resolve    : {
                SomeData: function ($q, Game) {
                    if (!Game.preloaded) {
                        var defer = $q.defer();
                        Game.preload(defer);
                        return defer.promise;
                    }
                }
            }
        };
    }

}