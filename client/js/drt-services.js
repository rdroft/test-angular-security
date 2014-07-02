/**
 * Created by roland on 7/1/14.
 */
var services = angular.module('drt-services',['ngCookies','ngRoute']);

services.factory('Auth',function($http,$rootScope,$cookieStore){
    var accessLevels = routingConfig.accessLevels;
    var userRoles = routingConfig.userRoles;
    var currentUser =$rootScope.user || {username:'',role:userRoles.public};

    console.log("roles: "+JSON.stringify(userRoles));
    var user = function(){
            return $rootScope.user||currentUser;
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
            console.log("user: "+JSON.stringify(user()));
            console.log("islogin::"+(user().role === userRoles.user||userRoles.admin));
            return (user().role === userRoles.user||userRoles.admin);
        },
        register:function(user,success,error){
              $http.post('signin',user).success(function(user){
                  $rootScope.user=user;
                  success(user);
              }).error(error);
        },
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
