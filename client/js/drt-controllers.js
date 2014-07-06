/**
 * Created by roland on 7/6/14.
 */
var app = angular.module('drt-controllers', ['drt','drt-services',"ui.bootstrap", "ngRoute", "ngCookies"]);
app.controller('SignInCtrl', function ($scope, $rootScope, $location, Auth) {
    $scope.email = "user@drt.com";
    $scope.password = "123";
    $scope.count = 0;
    $scope.singIn = function () {
        $scope.$on('LoginUpdated', function () {
            console.log("got isLOggedin: "+Auth.isLoggedIn());
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
    $scope.show = {signup:true}
    $scope.menue_template = 'views/mainmenue.html';
    $scope.username = "";
    $scope.showSignUp = false;
    $scope.$on('LoginUpdated', function () {
        if(Auth.isLoggedIn()) {
            $scope.username = Auth.getUser().username;
            $scope.showSignUp = Auth.isLoggedIn();
            $scope.show = {signup: false}
        }
    })
});

app.controller('DashboardCtrl', function($scope,  $modal) {
    $scope.createDraft = function() {
        var modalInstance = $modal.open({
            templateUrl : 'views/createdraft.html',
            controller : CreateDraftCtrl,
            size: 'sm'
        });
        modalInstance.result.then(function(){
            console.log("Modal Closed");
        },function(){
            console.log("Modal Closed");
        });
    };
})

var CreateDraftCtrl = function($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};