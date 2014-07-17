module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'client/libs/angular.js',
      'client/libs/angular-*.js',
      'client/libs/ui-bootstrap-tpls.js',
      'test/lib/angular/angular-mocks.js',
      'client/js/*.js',
      'test/unit/*.js'
    ],

    exclude : [
      'client/lib/angular/angular-loader.js',
      'client/lib/angular/*.min.js',
      'client/lib/angular/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome','Safari'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
