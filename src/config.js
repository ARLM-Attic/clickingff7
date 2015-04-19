System.config({
    meta: {
        'bower_components/angular/angular'                                    : {exports: 'angular'},
        'bower_components/angular-route/angular-route'                        : {deps: ['angular']},
        'bower_components/angular-route/angular-translate'                    : {deps: ['angular']},
        'bower_components/angular-route/angular-translate-loader-static-files': {deps: ['angular']}
    },
    map : {
        'angular'                              : 'bower_components/angular/angular',
        'angular-route'                        : 'bower_components/angular-route/angular-route',
        'angular-translate'                    : 'bower_components/angular-translate/angular-translate',
        'angular-translate-loader-static-files': 'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files'
    }
});