(function () {
	'use strict';

	var Profile = angular.module('profile', []);

	Profile.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('profile', {
        	parent: 'layout',
            url: '/profile',
            controller: 'ProfileController',
            controllerAs: 'profile',
            templateUrl: 'scripts/profile/profile.html',
            data: {
            	loggedIn: true
            }
        });
    }]);

    Profile.controller('ProfileController', ['identityService', 
    	function (identityService) {
    		var profile = this;
    		profile.identity = identityService.getUserIdentity();
    		profile.avatarUrlHeader = 'http://graph.facebook.com/' + profile.identity.id + '/picture?widht=150&height=150';
    		profile.avatarUrl = 'http://graph.facebook.com/' + profile.identity.id + '/picture?widht=200&height=200';
    }]);
}());