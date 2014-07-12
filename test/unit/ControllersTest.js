/**
 * Created by roland on 7/12/14.
 */
"use strict";
describe('O',function(){
    beforeEach(function() {
            module('drt-controllers');
        }
    );
    it('t1',function(){
        inject(function($rootScope, $controller,$location,$modal) {
            var scope = $rootScope.$new();
            $controller("CreateDraftCtrl",{$scope:scope,$modalInstance:{}});
        });
    });
    it('test',function(){
        inject(function($rootScope, $controller,$location,$modal) {
            var scope = $rootScope.$new();
            var ctrl = $controller("DashboardCtrl", {$scope: scope,$location:$location,$modal:$modal});
            scope.createDraft();
        });
    });
});

