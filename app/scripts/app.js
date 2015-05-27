(function  () {	

	'use strict';

	 angular
		.module('lybApp', 
			['ui.router', 'ui.bootstrap', 'lyb.home', 'product', 'layout', 'helper',
			'sidePanel', 'ceiboIT.restServices' ])

		.config(['$urlRouterProvider', '$stateProvider', 'restConfigProvider',
			function($urlRouterProvider, $stateProvider, restConfigProvider) {
			
			restConfigProvider.setBaseUrl('/api');

			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('layout', {
					abstract: true,
					templateUrl: 'scripts/layout/main.html',
					controller: 'LayoutController',
					controllerAs: 'layout'
				})
				.state('home' , {
					parent: 'layout',
					url: '/',
					templateUrl: 'scripts/home/home.html',
					controller:  'HomeController',
					controllerAs: 'homeController'
				})
				.state('view' , {
					// parent: 'layout',
					url: '/view',
					templateUrl: 'templates/view.html',
				})
				.state('profile' , {
					parent: 'layout',
					url: '/profile',
					templateUrl: 'templates/profile.html'
					//controller:  'footerCtrl'
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