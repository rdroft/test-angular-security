/**
 * Created by roland on 7/4/14.
 */
"use strict";
describe('AuthTest',function(){
    var auth;
    var rootScope;
    var exp;
    //excuted before each "it" is run.
    beforeEach(function() {
        module('drt-services');
        inject(function(Auth){
            auth = Auth;
        });
        inject(function($rootScope){
            rootScope = $rootScope;
        });
     //   spyOn(rootScope,'$broadcast').and.callThrough();
    });
    it('Authorization Module exist',function(){
        expect(auth===undefined).toBe(false);
    });
    //check functions
    it('Check interface',function(){
        expect(angular.isFunction(auth.login)).toBe(true);
        expect(angular.isFunction(auth.isLoggedIn)).toBe(true);
        expect(angular.isFunction(auth.authorize)).toBe(true);
        expect(angular.isFunction(auth.getUser)).toBe(true);
    });

    it('check login',function(){
       auth.login('user@drt.com',123);
       //spyOn($rootScope.user),);
       expect(rootScope.user === undefined).toBe(false);
       expect(rootScope.user).toEqual({username:'user@drt.com',role:auth.userRoles.user,password:'123'});
     //  expect(rootScope.$broadcast).toHaveBeenCalled();
    });

});