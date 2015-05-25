(function() {
	'use strict';

	var Helper = angular.module('helper', []);

	Helper.factory('loadTemplate', ['$http', '$templateCache', function ($http, $templateCache) {
		return function (templateUrl, templateName) {
			$http.get(templateUrl)
	    		.then(function (response) {
	     		   $templateCache.put(templateName, response.data);
	    		});
		};
    }]);

}());
