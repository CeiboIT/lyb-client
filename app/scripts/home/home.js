(function() {
    'use strict';

    var Home = angular.module('lyb.home', []);
    
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