(function() {
	'use strict';

	var Layout = angular.module('layout', []);

	Layout.controller('LayoutController', ['$state', function ($state) {
		var layout = this;

        layout.itemEntry = itemEntryCollection;

        layout.itemsVisble = true;
		layout.midRaise = true;
		layout.highRaise = false;
		layout.navBgWrapper = false; // side menu
        layout.mainWidgetMenu = true;
        layout.searchWigetWrapper = true;

		layout.itemMenu = function() {
            layout.itemsVisble = !layout.itemsVisble;
            layout.highRaise = false;
            layout.navBgWrapper = false;
            $state.go('home');
        };

		layout.mainNavMenu = function (){
            layout.navBgWrapper = !layout.navBgWrapper;
            layout.itemsVisble = false;
            layout.highRaise = false;
        };

        layout.followeringMenu = function (){
            layout.panelWigetWrapper = !layout.panelWigetWrapper;
        };
        
        layout.likeItems = function() {
            layout.highRaise = !layout.highRaise;
            layout.itemsVisble = false;
            layout.navBgWrapper = false;
        };
                
	}]);
}());
