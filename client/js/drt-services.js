/**
 * Created by roland on 7/1/14.
 */
"use strict";

var services = angular.module('drt-services',['ngCookies','ngRoute']);

services.factory('Auth',function($http,$rootScope,$cookieStore){
    var accessLevels = routingConfig.accessLevels;
    var userRoles = routingConfig.userRoles;
    var currentUser =$rootScope.user || {username:'',role:userRoles.public};
    var knownUsers = [
        {username:'user@drt.com',role:userRoles.user,password:'123'},
        {username:'admin@drt.com',role:userRoles.admin,password:'123'},
        {username:'public@drt.com',role:userRoles.public,password:'123'}
    ];
    console.log("roles: "+JSON.stringify(userRoles));
    var user = function(){
            return $rootScope.user||currentUser;
        };
    var statusChanged = function(){
        console.log("send evt");
        $rootScope.$broadcast('LoginSuccess');
    };
    return {
        authorize : function(requiredRole){
              if(user()===undefined){
                  return false;
              }
              var userRole = user().role;
              var ret =  (requiredRole&userRole)>0;
              console.log("user1: "+JSON.stringify(user()));
              console.log("Required : "+requiredRole+" role: "+userRole,"  result::"+ret);
              return ret;
        },
        isLoggedIn : function(){
            if(user()===undefined){
                return false;
            }
            return (user().role === userRoles.user||userRoles.admin);
        },
        register:function(user,success,error){
              $http.post('signin',user).success(function(user){
                  $rootScope.user=user;
                  success(user);
              }).error(error);
        } ,
        getUser: function(){
           return user();
        },
        login:function(email,password){
            console.log("try to login: "+email);
            var users = knownUsers.filter(function(value, index, ar){
                if(email == value.username&&password==value.password){
                    return value;
                }
            });
            var user = users[0];
            if(user==undefined){

            }else{
                $rootScope.user=user;
              console.log("loggedin: "+this.isLoggedIn());
                statusChanged();
            }
        }
        ,
        accessLevels: accessLevels,
        userRoles: userRoles
    }
});

services.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var authResult = Auth.authorize(next.access);
        console.log("X1 try: "+next.originalPath + " lvl: "+next.access+" authRes: "+authResult);
        if (!authResult) {
            if(Auth.isLoggedIn()) {
                console.log("Logged IN");
                $location.path('/signin');
            }
            else {
                $location.path('/signin');
            }
        }
    });
}]);
services.config(['$routeProvider','$locationProvider','$httpProvider',
    function($routeProvider,$locationProvider,$httpProvider){
        var intercepter = ['$location','$q',function($location,$q){
            function success(response){
                return response;
            }
            function error(response){
                if (response.status ===403){
                    $location.path('/signin');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
            return function(promise){
                return promise.then(success,error);
            }
        }];
        if($httpProvider.responseInterceptors===undefined)$httpProvider.responseInterceptors=[];
        $httpProvider.responseInterceptors.push(intercepter);
    }]);
