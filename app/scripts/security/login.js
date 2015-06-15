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