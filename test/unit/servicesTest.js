/**
 * Created by roland on 7/4/14.
 */
"use strict";
describe('AuthTest',function(){
    var auth;
    var rootScope;
    var exp;
    var testUser = {username:'user@drt.com',role:2,password:'123'};
    //excuted before each "it" is run.
    beforeEach(function() {
        module('drt-services');
        inject(function(Auth){
            auth = Auth;
        });
        inject(function($rootScope){
            rootScope = $rootScope;
        });
        spyOn(rootScope,'$broadcast').andCallThrough();

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
       auth.login(testUser.username,testUser.password);
       //spyOn($rootScope.user),);
       expect(rootScope.user === undefined).toBe(false);
       expect(rootScope.user).toEqual(testUser);
       expect(rootScope.$broadcast).toHaveBeenCalled();
       expect(rootScope.$broadcast.callCount).toEqual(1);
    });

    it('after login attempt event should be broadcasted',function(){
       auth.login(testUser.username,testUser.password);
       expect(rootScope.$broadcast.argsForCall).toEqual([['LoginUpdated']]);
    });
});