/**
 * Created by sbunlon on 14/05/2016.
 */

angular.module('polarApplication.services', [])

    .factory('apiUrl', function (API_URL){
        return {
            getApiUrl:function(){
                return API_URL+"/api";
            }
        }
    })

    .factory('productService', ["$http", "apiUrl", function($http, apiUrl){
        return {
            getProducts:function(){
                return $http.post(apiUrl.getApiUrl() + "/products",{});
            },
            
            saveProduct:function(name,price,onSale){
                return $http.post(apiUrl.getApiUrl() + "/product",{name:name, price:price, onSale:onSale})
            },

            createProduct:function(name,category,price,onSale){
                return $http.post(apiUrl.getApiUrl()+ "/products/new", {name:name, category:category, price:price, onSale:onSale})
            }
        }
    }])
    .factory('loginService', ['$http', 'apiUrl','AuthenticationService','$state', function ($http, apiUrl, AuthenticationService, $state){
        return {
            login:function (email, pass){
                return $http.post(apiUrl.getApiUrl() + "/login",{mail:email, password:pass});
            },
            logout: function (){
                AuthenticationService.endSession();
                $state.go("app.home",{},{reload:true});
            },
            loginFromCas: function(username){
                console.log(apiUrl.getApiUrl() + "/caslogin");
                return $http.post(apiUrl.getApiUrl() + "/caslogin", {username:username});
            }
        }
    }])
    .factory('mailService', ['$http', 'apiUrl', function ($http, apiUrl){
        return {
            contactMail:function (mail, subject, text){
                return $http.post(apiUrl.getApiUrl() + "/mail/contact",{mail:mail, text:text, subject:subject});
            },
        }
    }])
    .factory('usersService', ['$http', 'apiUrl', function ($http, apiUrl){
        return {
            getAll:function(){
                return $http.post(apiUrl.getApiUrl() + "/users",{});
            },
            new:function(lastName, firstName, mail, password, accountType){
                return $http.post(apiUrl.getApiUrl() + "/users/new", {lastName:lastName, firstName:firstName, mail:mail,password:password, accountType:accountType});
            }
        }
    }])
    .factory('AuthenticationService',['$window', function ($window){
        return {
            isAuthenticated:false,
            createSession:function(user, token){
                $window.localStorage.user = JSON.stringify(user);
                $window.localStorage.token = token;
            },
            endSession:function(){
                delete $window.localStorage.user;
                delete $window.localStorage.token;
            },
            isLogged:function(){
                return (angular.isDefined($window.localStorage.user) && angular.isDefined($window.localStorage.token));
            },
            getUserLogged:function(){
                return JSON.parse($window.localStorage.user || null);
            },
            refreshUser:function(user){
                $window.localStorage.user = JSON.stringify(user);
            },
            setStateAsked:function(state){
                $window.localStorage.stateAsked = state;
            },
            getStateAsked:function(){
                var state = $window.localStorage.stateAsked;
                delete $window.localStorage.stateAsked;
                return state;
            }
        };
    }])