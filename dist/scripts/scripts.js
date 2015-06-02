(function  () {	

	'use strict';

	 angular
		.module('lybApp', 
			['ui.router', 'ui.bootstrap', 'lyb.home', 'product', 'layout', 'helper',
			'sidePanel', 'ceiboIT.restServices' ])

		.config(['$urlRouterProvider', '$stateProvider', 'restConfigProvider',
			function($urlRouterProvider, $stateProvider, restConfigProvider) {
			
			restConfigProvider.setBaseUrl('/api');

			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('layout', {
					abstract: true,
					templateUrl: 'scripts/layout/main.html',
					controller: 'LayoutController',
					controllerAs: 'layout'
				})
				.state('home' , {
					parent: 'layout',
					url: '/',
					templateUrl: 'scripts/home/home.html',
					controller:  'HomeController',
					controllerAs: 'homeController'
				})
				.state('view' , {
					// parent: 'layout',
					url: '/view',
					templateUrl: 'templates/view.html',
				})
				.state('profile' , {
					parent: 'layout',
					url: '/profile',
					templateUrl: 'templates/profile.html'
					//controller:  'footerCtrl'
				})
				.state('following' , {
					parent: 'layout',
					url: '/following',
					templateUrl: 'templates/following.html'
					//controller:  'footerCtrl'
				})
				.state('followers' , {
					parent: 'layout',
					url: '/followers',
					templateUrl: 'templates/followers.html'
					//controller:  'aboutCtrl'
				});
		}]);
}());
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

(function () {
    'use strict';

    var RestServices = angular.module('ceiboIT.restServices', ['restangular']);

    RestServices.provider('restConfig', [function (){
        var baseUrl = '/';

        this.setBaseUrl = function (url) {
            baseUrl = url;
        };

        this.$get = ["Restangular", function (Restangular) {
            return {
                getBaseUrl: function () {
                    return baseUrl;
                },
                getRestForEntity: function (entityName) {
                    var baseUrl = this.getBaseUrl();
                    return Restangular.withConfig(function (RestangularConfigurer) {
                        RestangularConfigurer.setBaseUrl(baseUrl);
                        // add headers for authentication based request
                        RestangularConfigurer.setDefaultHeaders({ 'withCredentials': 'true'} );
                        // override default 'id' with '_id' to work with mongoDB
                        RestangularConfigurer.setRestangularFields({ id:'_id'});
                    }).service(entityName);
                }
            };    
        }];
    }]);
            
    RestServices.factory('entityService', ["$q", "Restangular", "restConfig", function ($q, Restangular, restConfig) {
        return {
            getCrudFor: function (entityName, formatters) {
                return {
                    rest: restConfig.getRestForEntity(entityName),
                    getAll: function () {
                        return this.rest.getList();
                    },
                    update: function (entity) {
                         if (formatters && formatters.preUpdate) {
                            return formatters.preUpdate(entity).put();
                        }
                        return entity.put();
                    },
                    save: function (entity) {
                        if (formatters && formatters.preSave) {
                            return this.rest.post(formatters.preSave(entity));
                        }
                        return this.rest.post(entity);
                    },
                    remove: function (entity) {
                        return entity.remove();
                        // return this.rest.one('remove').one(entity.id.toString()).post(); 
                    },
                    createEntity: function () {
                        return this.rest.one();
                    },
                    get: function (id) {
                        return this.rest.one(id).get();
                    },
                    copy: function(original) {
                        return Restangular.copy(original);
                    },
                    newEntity:  function () { //to override in the specific services
                        return {};
                    }
                };
            }
        };
    }]);
}());
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
			$modal.open(defaultOptions);
        };
        
	    return sidePanel;
	}]);

}());
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
var itemEntryCollection = [
        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/1500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011608172_img_4169.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '£59.99',
            'itemImage': [
                     { 'image': 'http://www.youmustcreate.com/site/wp-content/uploads/2013/06/alim_side-310x390.jpg' },
                     { 'image': 'http://www.youmustcreate.com/site/wp-content/uploads/2013/06/slim007-pale-tortoise-sun-950x1216.jpg'},
                     { 'image': 'http://www.youmustcreate.com/site/wp-content/uploads/2013/06/slim_yellow_sun-310x390.jpg?b1f7f4'}
            ],
            'relatedItems': [ 
                {'items': 'http://www.youmustcreate.com/site/wp-content/uploads/2013/06/rocco_front_15-950x1216.jpg'},
                {'items': 'http://www.youmustcreate.com/site/wp-content/uploads/2013/06/bonafidegreen-950x1216.jpg'},
                {'items': 'http://www.youmustcreate.com/site/wp-content/uploads/2013/06/bonafidegreen-950x1216.jpg'}
            ]
        },
        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011513865_img_0728.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },
        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011501343_img_6051.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },

        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011513865_img_0728.jpg',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },

        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011521679_img_9173.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },
        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/w/h/white_1.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },
        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011488743_img_4474.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },

        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011482222_img_3576-copie.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },


        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011372653_img_5256.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },

        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011489818_img_4632.jpg',
            'productTitle': 'Acid Print Sweat',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },

        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/0/0/0000011465126_img_0197.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },

        {
            'image': 'http://cdn.colette.fr/media/catalog/product/cache/1/image/500x/9df78eab33525d08d6e5fb8d27136e95/h/a/haas1.jpg',
            'productTitle': 'Tuck Stitch',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },

        {
            'image': 'http://www.youmustcreate.com/site/wp-content/uploads/2013/06/slim007-pale-tortoise-sun-950x1216.jpg',
            'productTitle': 'Mc Ginn Slim',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        },


        {
            'image': 'http://www.colette.fr/media/push/swa_mmm_001255.jpg',
            'productTitle': 'Ipath lowrunner',
            'productDesc': 'Low skateshoes - Grey',
            'user': 'Nate knows',
            'price': '$17'
        }
];


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