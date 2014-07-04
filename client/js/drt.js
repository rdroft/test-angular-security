/**
 * Created by roland on 6/29/14.
 */
"use strict";

(function (exports) {

    var userRoles = {
        public: 1, // 001
        user: 2, // 010
        admin: 4  // 100
    };

    exports.userRoles = userRoles;
    exports.accessLevels = {
        public: userRoles.public | // 111
            userRoles.user |
            userRoles.admin,
        anon: userRoles.public,  // 001
        user: userRoles.user |   // 110
            userRoles.admin,
        admin: userRoles.admin    // 100
    };

})(typeof exports === 'undefined' ? this['routingConfig'] = {} : exports);


(function () {
    var app = angular.module('drt', ['drt-services', "ngRoute", "ngCookies"]);
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
    app.controller('SignInCtrl', function ($scope, $rootScope, $location, Auth) {
        $scope.email = "user@drt.com";
        $scope.password = "123";
        $scope.count = 0;
        $scope.singIn = function () {
            $scope.$on('LoginSuccess', function () {
                console.log("got event:"+Auth.isLoggedIn());
                if (Auth.isLoggedIn()) {
                    console.log("navigate to /");
                    $location.path("/");
                } else {
                    console.log("wrong passw: " + $scope.count);
                    if ($scope.count++ == 3) {
                        console.log("nav to: /restorepasswd " + $scope.count);
                        $location.path('/restorepasswd');
                    }
                }
            });
            Auth.login($scope.email, $scope.password);
        }
    });
    app.controller('DashboardCtrl', function ($location) {

    });
    app.controller('SignUpCtrl', function ($scope, $location) {
            $scope.message = "";
            $scope.singUp = function () {
                if ($scope.password == $scope.password2) {
                    $location.path('/signin');
                } else {
                    $scope.message = "Passwords should be equal";
                }
            }
        }
    );

    app.controller('MainCtrl', function ($scope, Auth) {

        $scope.menue_template = 'views/mainmenue.html';
        $scope.username = "";
        $scope.showSignUp = false;
        $scope.$on('LoginSuccess', function () {
            $scope.username = Auth.getUser().username;
            $scope.showSignUp = Auth.isLoggedIn();
        })
    });

})();