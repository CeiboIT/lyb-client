(function  () {	

	'use strict';

	 angular
		.module('lybApp', 
			['ui.router', 'ui.bootstrap', 'lyb.home', 'product', 'layout', 'helper',
			'sidePanel', 'ceibo.auth', 'ceibo.login', 'ceiboIT.restServices', 'profile', 
			'ngFacebook'])

		.config(['$urlRouterProvider', '$stateProvider', 'restConfigProvider', '$httpProvider',
			function($urlRouterProvider, $stateProvider, restConfigProvider, $httpProvider) {
			
			restConfigProvider.setBaseUrl('/api');
			// $httpProvider.interceptors.push('responseErrorInterceptor');
			$httpProvider.defaults.withCredentials = true;
    		$httpProvider.interceptors.push('authInterceptor');

			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('layout', {
					abstract: true,
					templateUrl: 'scripts/layout/main.html',
					controller: 'LayoutController',
					controllerAs: 'layout'
				})
				.state('view' , {
					url: '/view',
					templateUrl: 'templates/view.html',
				})
				.state('following' , {
					parent: 'layout',
					url: '/following',
					templateUrl: 'templates/following.html'
					//controller:  'footerCtrl'
				})
				.state('followers' , {
					parent: 'layout',
					url: '/followers',
					templateUrl: 'templates/followers.html'
					//controller:  'aboutCtrl'
				});
		}]);
}());