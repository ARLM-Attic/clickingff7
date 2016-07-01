module.exports = function (config) {
    config.set({

        frameworks: [
            //'jspm',
            'jasmine'
        ],

        reporters: ['progress'],

        browsers: ['PhantomJS'],

        //jspm: {
        //    loadFiles: ['test/**/*.js'],
        //    serveFiles: ['app/**/*.js']
        //},

        files: [
            //'dist/commons/bootstrap.js',
            'test/**/*.js'
        ]

    })
};
