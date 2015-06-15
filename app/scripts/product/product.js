(function() {
	
	'use strict';	

	var Product = angular.module('product', []);
	
	Product.run(['loadTemplate', function (loadTemplate) {
		loadTemplate('scripts/product/product_detail.html', 'product_detail');
		loadTemplate('scripts/product/product_list_item.html', 'product_list_item');
	}]);

	Product.controller('ProductDetailController', 
		['$log', '$modalInstance', 'product', function ($log, $modalInstance, product) {
		var controller = this;
		controller.product = product;
		
		controller.cancel = function () {
			$log.debug('ProductDetailController > cancel');
    		$modalInstance.dismiss('cancel');
  		};

		controller.buyOnStore = function (product) {
			$log.debug('ProductDetailController > buyOnStore > ' + product);
		};

	}]);

	Product.factory('productViewService', 
		['$templateCache', 'sidePanelService', function ($templateCache, sidePanelService) {

		return function productViewService(product) {
			sidePanelService.open({
				template: $templateCache.get('product_detail'),
				controller: 'ProductDetailController',
				controllerAs: 'view',
				resolve: {
					product: function () {
						return product;
					}
				}
			});
		};
	}]);

	Product.factory('productService', ['$log', 'restConfig', 'authService',
		function($log, restConfig) {
		var service = restConfig.getRestForEntity('products');
		var productService = { // only provide a subset of operations
			getAll: function () {
				return service.getList();
			},
			likeIt: function (product) {
				product.post('like');
			},
			shareIt: function (product) {
				$log.debug('shareIt > ' + JSON.stringify(product));
			}
		};
		return productService;
	}]);

	Product.controller('productViewController', ['productViewService', 'productService',
		function (productViewService, productService) {
			var productViewController = this;
			productViewController.openProduct = function (product) {
				productViewService(product);
			};
			productViewController.likeIt = function (product) {
	            productService.likeIt(product);
	        };
	}]);

	Product.directive('productView', 
		['$templateCache', 'productViewService', function ($templateCache) {
		return {
			restrict: 'E',
			scope: {
				product: '='
			},
			template: $templateCache.get('product_list_item'),
			controller: 'productViewController',
			controllerAs: 'productController'
		};
	}]);

}());