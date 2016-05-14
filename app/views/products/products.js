angular.module('polarApplication.products', ["ui.router"])

.config(function ($stateProvider){
    
    $stateProvider
    .state('app.products', {
        url: "/products",            
        templateUrl: "views/products/products.html",
        controller: "homeCtrl",      
    });
})

.controller("homeCtrl",["$scope","$state","$http", function ($scope, $state, $http){    
    
}])
