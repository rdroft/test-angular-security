/**
 * Created by roland on 7/4/14.
 */
"use strict";
describe('AuthTest',function(){
    var auth;
    //excuted before each "it" is run.
    beforeEach(function() {
        module('drt-services');
        inject(function(Auth){
            auth = Auth;
        })
    });
    it('Authorization Module exist',function(){
        expect(auth).not().toEqual(undefined);
    });
    //check functions
    it('Check interface',function(){
        expect(angular.isFunction(auth.login)).toBe(true);
        expect(angular.isFunction(auth.isLoggedIn)).toBe(true);
        expect(angular.isFunction(auth.authorize)).toBe(true);
        expect(angular.isFunction(auth.getUser)).toBe(true);
    });

    it('check login',function(){

    })

});