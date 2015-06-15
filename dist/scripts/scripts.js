(function  () {	

	'use strict';

	 angular
		.module('lybApp', 
			['ui.router', 'ui.bootstrap', 'lyb.home', 'product', 'layout', 'helper',
			'sidePanel', 'ceibo.auth', 'ceibo.login', 'ceiboIT.restServices', 'profile', 
			'ngFacebook'])

		.config(['$urlRouterProvider', '$stateProvider', 'restConfigProvider', '$httpProvider',
			function($urlRouterProvider, $stateProvider, restConfigProvider, $httpProvider) {
			
			restConfigProvider.setBaseUrl('/api');
			// $httpProvider.interceptors.push('responseErrorInterceptor');
			$httpProvider.defaults.withCredentials = true;
    		$httpProvider.interceptors.push('authInterceptor');

			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('layout', {
					abstract: true,
					templateUrl: 'scripts/layout/main.html',
					controller: 'LayoutController',
					controllerAs: 'layout'
				})
				.state('view' , {
					url: '/view',
					templateUrl: 'templates/view.html',
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
			return $modal.open(defaultOptions);
        };
        
	    return sidePanel;
	}]);

}());
(function() {
	'use strict';

	var Layout = angular.module('layout', []);

	Layout.controller('LayoutController', ['$state', 'authService', 
        function ($state, authService) {
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

        layout.logout = function () {
            authService.facebookLogout();
        };
                
	}]);
}());

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
(function () {
    'use strict';

    var AuthService = angular.module('ceibo.auth', ['ngFacebook']);
    
    AuthService.factory('authInterceptor', 
        ['$q', '$injector', '$log',
        function ($q, $injector, $log) {
        return {
            responseError: function (response) {
                if(response.status === 403 || response.status === 401) {
                    $log.debug('403 returned');
                    $injector.get('loginView')();
                    // $injector.get('$state').go('login');
                }
                return $q.reject(response);
            }
        };
    }]);
    
    AuthService.run([ '$rootScope', 'authorization', 'identityService', 
        function($rootScope, authorization, identityService) {
        // escucha por cambios en la url/states
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            authorization.authorize(event);
        });
        identityService.restoreUser();
    }]);

    AuthService.factory('identityService', ['$log', '$window',
        function ($log, $window) {
        var identity = false,
            identityService = {
                setIdentity: function (newIdentity) {
                    identity = newIdentity;
                    var identityJson = angular.toJson(newIdentity);
                    $log.debug('userIdentity: ' + identityJson);
                    $window.sessionStorage.setItem('lyb.identity', identityJson);
                },
                removeIdentity: function () {
                    identity = undefined;
                    $window.sessionStorage.removeItem('lyb.identity');
                },
                getUserIdentity: function () {
                    // recupera la identity del user, si no, lanza un reject para ser manejado por el caller.
                    // Devuelve una promise por si hay que re-loginiar al user.
                    // var deferred = $q.defer();
                    return identity || this.restoreUser();
                    // if (identity) {
                    //     deferred.resolve(identity);
                    // } else {
                    //     deferred.reject({ error: 'Not logged user'});
                    // }
                    // return deferred.promise;
                },
                restoreUser: function () {
                    // recupera la identity del usuario desde sessionStorage.
                    var saved = $window.sessionStorage.getItem('lyb.identity');
                    if (saved) {
                        $log.debug('user restored ' + saved);
                        return angular.fromJson(saved);
                    }
                    return false; // no estaba la identity en la sesion
                },
                isAuthenticated: function() {
                    return identity || this.restoreUser();
                }
            };
            return identityService;
    }]);

    AuthService.factory('authService', 
        ['$window', '$state', '$http', '$facebook', 'identityService', 
        function ($window, $state, $http, $facebook, identityService) {
        var auth = {
            facebookLogin: function () {
                return $facebook.login()
                    .then(function() {
                        $facebook.api('/me').then( 
                            function(response) {
                                identityService.setIdentity(response);
                            });
                        return $facebook.getLoginStatus()
                            .then(function (response) {
                                if (response.status === 'connected') {
                                    var accessToken = response.authResponse.accessToken;
                                    $http.defaults.headers.common['access_token'] = accessToken;
                                    return response;
                                }});
                        });

            }, 
            facebookLogout: function () {
                $http.post('/api/auth/logout');
                identityService.removeIdentity();
                return $facebook.logout();
            },
            getUser: function () {
                var user = $window.sessionStorage.getItem('lyb.identity');
                return JSON.parse(user);
            }
        };
        return auth;
    }]);

    AuthService.config(["$facebookProvider", function($facebookProvider) {
        $facebookProvider.setAppId('822272877864083');
    }]);

    AuthService.run([function() {
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
            js = d.createElement(s); js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
    }]);

    AuthService.factory('authorization', 
        ['$rootScope', '$state', '$log', 'identityService', 'loginView',
        function($rootScope, $state, $log, identityService, loginView) {
            /* Authorize every state transition */
            var canIGoToTheState = function (toState) {
                if (toState.data && toState.data.loggedIn) {
                    return identityService.getUserIdentity();
                }
                return true;
            };
            return {
                authorize: function(event) {
                    $log.debug('trying to transition to state: ' + $rootScope.toState.name);
                    if (!canIGoToTheState($rootScope.toState)) {
                        $log.debug('the user can not go to the state: ' + $rootScope.toState.name);
                        // save the state they wanted before redirect him to signin state
                        $log.debug('because it is not authenticated');
                        $rootScope.returnToState = $rootScope.toState; 
                        $rootScope.returnToStateParams = $rootScope.toStateParams;
                        if (event) { event.preventDefault(); }
                        loginView();
                        // $state.go('login'); // now, send them to the signin state so they can log in
                    }
                }   
            };
    }]);
}());
(function () {
    'use strict';

    var Login = angular.module('ceibo.login', ['restangular']);

    // Login.run(['loadTemplate', function (loadTemplate) {
    //     loadTemplate('scripts/security/login.html', 'login');
    // }]);

    Login.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            // controller: 'LoginControllerView',
            data: {
                loggedIn: false
            },
            onEnter: ['loginView', function (loginView) {
                loginView();
            }]
            // templateUrl: 'scripts/security/login.html'
        });
    }]);

    Login.factory('loginView', 
        ['sidePanelService', function (sidePanelService) {
        return function lgoinView() {
            var loginModal = sidePanelService.open({
                templateUrl: 'scripts/security/login.html',
                controller: 'LoginController',
                controllerAs: 'loginController'
            });
            return {
                close: function () {
                    loginModal.close();
                }
            };
        };
    }]);

    Login.controller('LoginControllerView', ['loginView', function (loginView) {
        loginView();
    }]);

    Login.controller('LoginController', 
        ['$state', '$modalInstance', '$log', 'authService', '$facebook', '$http',
        function ($state, $modalInstance, $log, authService, $facebook, $http) {
    
        var login = this;
        
        login.invalidLogin = false;
        login.credentials = { username: '', password: '' };
    
        login.loginFacebook = function() {
            authService.facebookLogin()
                .then(function () {
                    $modalInstance.close();
                });
        };

    }]);

} ());
(function () {
	'use strict';

	var Profile = angular.module('profile', []);

	Profile.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('profile', {
        	parent: 'layout',
            url: '/profile',
            controller: 'ProfileController',
            controllerAs: 'profile',
            templateUrl: 'scripts/profile/profile.html',
            data: {
            	loggedIn: true
            }
        });
    }]);

    Profile.controller('ProfileController', ['identityService', 
    	function (identityService) {
    		var profile = this;
    		profile.identity = identityService.getUserIdentity();
    		profile.avatarUrlHeader = 'http://graph.facebook.com/' + profile.identity.id + '/picture?widht=150&height=150';
    		profile.avatarUrl = 'http://graph.facebook.com/' + profile.identity.id + '/picture?widht=200&height=200';
    }]);
}());