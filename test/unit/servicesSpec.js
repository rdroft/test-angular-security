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
    //check functions
    it('should have functions',function(){
        expect(angular.isFunction(auth.login)).toBe(true);
    });
});