(function () {
	'use strict';

	var Footerbar = angular.module('footerbar', []);

	Footerbar.directive('footerbar', function () {
		return {
			strict: 'E',
			templateUrl: 'scripts/layout/footer_bar.html',
			controller: 'FooterbarController',
			controllerAs: 'footer'
		};
	});

	Footerbar.controller('FooterbarController', [function () {
		var footer = this;

	}]);

}());