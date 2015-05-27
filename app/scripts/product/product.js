(function() {
	
	'use strict';	

	var Product = angular.module('product', []);
	
	Product.run(['loadTemplate', function (loadTemplate) {
		loadTemplate('scripts/product/product_detail.html', 'product_detail');
		loadTemplate('scripts/product/product_list_item.html', 'product_list_item');
	}]);

	Product.factory('productActions', ['$log', function ($log) {
		var actions = {};
		
		actions.likeIt = function (product) {
			$log.debug('likeIt > ' + JSON.stringify(product));
		};

		actions.shareIt = function (product) {
			$log.debug('shareIt > ' + JSON.stringify(product));
		};

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

	Product.factory('productService', ['$log', 'restConfig', function($log, restConfig) {
		var service = restConfig.getRestForEntity('products');
		var productService = {
			getAll: function () {
				return service.getList();
			}
		};
		return productService;
	}]);

	Product.directive('productView', 
		['$templateCache', 'productViewService', function ($templateCache, productViewService) {
		return {
			restrict: 'E',
			scope: {
				product: '='
			},
			template: $templateCache.get('product_list_item'),
			controller: function() {
				var controller = this;
				controller.openProduct = function (product) {
					productViewService(product);
				};
			},
			controllerAs: 'productController'
		};
	}]);

}());