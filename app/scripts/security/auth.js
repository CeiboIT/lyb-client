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
                    return identity || this.restoreUser();
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
                                }})
                            .then(function () {
                                return $http.get('/api/auth/facebook/callback');
                            });
                        });

            }, 
            facebookLogout: function () {
                $http.post('/api/auth/logout');
                identityService.removeIdentity();
                $facebook.logout();
                $state.go('home');
            },
            getUser: function () {
                var user = $window.sessionStorage.getItem('lyb.identity');
                return JSON.parse(user);
            }
        };
        return auth;
    }]);

    AuthService.config(function($facebookProvider) {
        $facebookProvider.setAppId('823739627717408'); // test app
    });

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