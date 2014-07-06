/**
 * Created by roland on 6/29/14.
 */
"use strict";
var app = angular.module('drt', ['drt-services','drt-controllers',"ui.bootstrap", "ngRoute", "ngCookies"]);
    app.config(function ($routeProvider) {
        var access = routingConfig.accessLevels;
        $routeProvider.when('/signup', {
            controller: 'SignUpCtrl',
            templateUrl: 'views/signup.html',
            access: access.public
        });
        $routeProvider.when('/', {
            controller: 'DashboardCtrl',
            templateUrl: 'views/dashboard.html',
            access: access.user
        });
        $routeProvider.when('/signin', {
            controller: 'SignInCtrl',
            templateUrl: 'views/signin.html',
            access: access.public
        });
        $routeProvider.when('/accessdenied', {
            templateUrl: 'views/accessdenied.html',
            access: access.public
        });
        $routeProvider.when('/restorepasswd', {
            templateUrl: 'views/restorepasswd.html',
            access: access.public
        });
    });

