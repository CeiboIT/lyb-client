(function() {
    'use strict';

    var Home = angular.module('lyb.home', []);
    
    Home.controller('HomeController', 
        [function () {

        var homeController = this;

        homeController.itemEntry = itemEntryCollection;
        
    }]);

} ());