(function() {
    'use strict';

    var Home = angular.module('lyb.home', []);

    Home.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home' , {
            parent: 'layout',
            url: '/',
            templateUrl: 'scripts/home/home.html',
            controller:  'HomeController',
            controllerAs: 'homeController',
            data: {
                loggedIn: false
            }
        });
    }]);

    Home.controller('HomeController', 
        ['$log', 'productService', function ($log, productService) {

        var homeController = this;

        productService.getAll()
        	.then(function (response){
        		homeController.itemEntry = response;
        	});
        // homeController.itemEntry = itemEntryCollection;
    }]);

} ());