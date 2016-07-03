module.exports = function(config) {
    config.set({

        browsers: [
            'PhantomJS'
        ],

        frameworks: [
            'jspm',
            'jasmine'
        ],

        jspm: {
            loadFiles: [
                'test/**/*.js'
            ],
            serveFiles: [
                'app/**/*.js'
            ]
        },

        preprocessors: {
            '{app,test}/**/*.js': ['babel']
        },

        babelPreprocessor: {
            options: {
                presets: ['es2015'],
                sourceMap: 'inline'
            }
        },

        proxies: {
            '/app/': '/base/app/',
            '/test/': '/base/test/',
            '/jspm_packages/': '/base/jspm_packages/'
        },

        reporters: ['progress']
    });
};