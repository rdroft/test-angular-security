/**
 * Created by roland on 7/1/14.
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

var services = angular.module('drt-services',['ngCookies','ngRoute']);
services.factory('DocumentService',function($http,$rootScope){
    var storage = [
        {id:0,name:'US-1847a',project:'DBS',useCase:'US-1847a',status:1},
        {id:1,name:'Email',project:'DBS',useCase:'US-1848a',status:2},
        {id:2,name:'Push',project:'DBS',useCase:'US-1847a',status:3},
        {id:3,name:'US-1111a',project:'DBS',useCase:'US-1847a',status:4},
        {id:4,name:'US-1234a',project:'DBS',useCase:'US-1847a',status:1},
        {id:5,name:'US-5678a',project:'DBS',useCase:'US-1847a',status:2}
    ];

        return{
            retrieve: function (id) {
                return storage[id];
            },
            save: function (document) {
                var id = storage.length;
                document.id = id;
                storage.push(document);
                console.log('save '+id+" "+JSON.stringify(document));
                return id;
            },
            sendToReview: function () {
            },
            list: storage
        };
});
services.factory('Integration',function($http,$rootScope){
    return {
       useCaseList: function(){
           return ['US0001','US0002','US1536b'];
       },
       projectList: function(){
            return ['DBS','DBR','TFM','BASEM'];
       }
    };
});
services.factory('Auth',function($http,$rootScope,$cookieStore){
    var accessLevels = routingConfig.accessLevels;
    var userRoles = routingConfig.userRoles;
    var currentUser =$rootScope.user || {username:'',role:userRoles.public};
    var knownUsers = [
        {username:'user@drt.com',role:userRoles.user,password:'123'},
        {username:'admin@drt.com',role:userRoles.admin,password:'123'},
        {username:'public@drt.com',role:userRoles.public,password:'123'}
    ];
    console.log("Auth roles: "+JSON.stringify(userRoles));
    var user = function(){
            return $rootScope.user||currentUser;
        };
    var statusChanged = function(){
        $rootScope.$broadcast('LoginUpdated');
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
            return user().role === userRoles.user||user().role===userRoles.admin;
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
            console.log("Auth try to login: "+email);
            var users = knownUsers.filter(function(value, index, ar){
                if(email == value.username&&password==value.password){
                    return value;
                }
            });
            var user = users[0];
            if(user==undefined){
                statusChanged();
            }else{
                $rootScope.user=user;
              console.log("Auth: loggedin: "+this.isLoggedIn());
                statusChanged();
            }
        }
        ,
        accessLevels: accessLevels,
        userRoles: userRoles
    }
});

services.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
 var signInPage = '/signin';
 var rootPage = '/';
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var authResult = Auth.authorize(next.access);
        console.log("Interceptor: try: "+next.originalPath + " lvl: "+next.access+" authRes: "+authResult);
        if (!authResult) {
            if(Auth.isLoggedIn()) {
                console.log("Interceptor: Logged IN");
                $location.path(signInPage);
            }
            else {
                console.log("Interceptor: NOT Logged IN navigate to sing in");
                $location.path(signInPage);
            }
        }else{
            if(next.originalPath==signInPage){
                if(Auth.isLoggedIn()){
                    $location.path(rootPage);
                }
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
