(function() {
	'use strict';

	var SidePanel = angular.module('sidePanel', []);

	SidePanel.factory('sidePanelService', 
		[ '$log', '$timeout', '$modal', function ($log, $timeout, $modal) {
		
		var sidePanel = {};

		sidePanel.open = function open(options) {
			var defaultOptions = {
				windowTemplateUrl: 'scripts/commons/sidePanel/panel_window.html',
				backdropClass: 'lightouts'
			};
			angular.extend(defaultOptions, options);
			return $modal.open(defaultOptions);
        };
        
	    return sidePanel;
	}]);

}());