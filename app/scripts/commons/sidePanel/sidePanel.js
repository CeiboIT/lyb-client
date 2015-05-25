(function() {
	'use strict';

	var SidePanel = angular.module('sidePanel', []);

	SidePanel.run(['loadTemplate', function (loadTemplate) {
		loadTemplate('scripts/commons/sidePanel/panel_view.html', 'panel_view');
	}]);

	SidePanel.directive('sidePanel', 
		['$templateCache', 'sidePanelService', function ($templateCache, sidePanelService) {
		return {
			restrict: 'E',
			tempalte: $templateCache.get('panel_view'),
			controller: function() {
				var controller = this;
				controller = sidePanelService;
				return controller;
			},
			controllerAs: 'sidePanel'
		};
	}]);

	SidePanel.factory('sidePanelService', 
		[ '$log', '$timeout', '$modal', function ($log, $timeout, $modal) {
		
		var sidePanel = {};
			// content: '',
			// state: { 
			// 	open: false, 
		 //        content: null,
			//     model: {}
	  //   	}
	  //   };

		sidePanel.open = function open(options) {
			var defaultOptions = {
				windowTemplateUrl: 'scripts/commons/sidePanel/panel_window.html',
				backdropClass: 'lightouts'
			};
			angular.extend(defaultOptions, options);
			$modal.open(defaultOptions);
        };
        
        // panelView.closePanelView = function closePanelView() {
        //     panelView.state.open = false;
        //     panelView.state.model = {};
        //     panelView.siteBlackout = false;
        //     // Remove the HTML content from the panel within 750 milliseconds.
        //     $timeout(function timeout() {
        //         panelView.content = null;
        //     }, 750);
        // };

	    return sidePanel;
	}]);

}());